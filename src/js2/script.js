
var txt = "test1\ntest2";
txt = txt.split('\n');


function ascii_conv(font_image)
{
    const TXT2IMG_CHAR_W = 14;
    const TXT2IMG_CHAR_H =  9;

    const IMG2TXT_CHAR_W = 2;
    const IMG2TXT_CHAR_H = 3;

    const SEVEN = (TXT2IMG_CHAR_W / IMG2TXT_CHAR_W);
    const THREE = (TXT2IMG_CHAR_H / IMG2TXT_CHAR_H);

    const IMG2TXT_PIXNUM = (IMG2TXT_CHAR_H * IMG2TXT_CHAR_W);
    const IMG2TXT_WEIGHT_COUNT = (1 + IMG2TXT_PIXNUM);

    var font_weights = Array(0x100);
    var font_offsets = Array(0x100);

    function chunk_sum(data, y, x)
    {
        var val = 0;
        for ( var i = 0; i < THREE; i++ )
            for ( var j = 0; j < SEVEN; j++ )
                if ( data[((y * THREE + i) * TXT2IMG_CHAR_W + (x * SEVEN + j)) * 4] == 0 )
                    val++;
        return val;
    }

    function char_weights(data)
    {
        var out = new Float32Array(IMG2TXT_WEIGHT_COUNT);
        var idx = 0;

        var total = 0;
        for ( var y = 0; y < TXT2IMG_CHAR_H; y++ )
            for ( var x = 0; x < TXT2IMG_CHAR_W; x++ )
                if ( data[(y * TXT2IMG_CHAR_W + x) * 4] == 0 )
                    total++;
        out[idx++] = total;

        for ( var y = 0; y < TXT2IMG_CHAR_H / THREE; y++ )
            for ( var x = 0; x < TXT2IMG_CHAR_W / SEVEN; x++ )
                out[idx++] = chunk_sum(data, y, x);

        return out;
    }

    function prepare_font()
    {
        var temp_canvas = document.createElement('canvas');
        temp_canvas.height = font_image.height;
        temp_canvas.width = font_image.width;
        var temp_ctx = temp_canvas.getContext('2d');
        temp_ctx.drawImage(font_image, 0, 0);

        var off_x = 0;
        var off_y = 0;

        var c = 0x20;
        while ( off_y <= font_image.height )
        {
            char_data = temp_ctx.getImageData(off_x, off_y, TXT2IMG_CHAR_W, TXT2IMG_CHAR_H);
            font_weights[c] = char_weights(char_data.data);
            font_offsets[c] = [ off_x, off_y ];
            off_x += TXT2IMG_CHAR_W + 1;
            if ( off_x > font_image.width )
            {
                off_x = 0;
                off_y += TXT2IMG_CHAR_H + 1;
            }
            c++;
        }
    }

    function fix_weights()
    {
        var max_total = 0;
        var max_cell = 0;

        for ( var c = 0x20; c < 0x7f; c++ )
        {
            var total = font_weights[c][0];
            if ( total > max_total )
                max_total = total;
            for ( var i = 1; i < IMG2TXT_WEIGHT_COUNT; i++ )
            {
                var cell = font_weights[c][i];
                if ( cell > max_cell )
                    max_cell = cell;
            }
        }

        var mult_total = 255. / max_total;
        var mult_cell = 255. / max_cell;
        for ( var c = 0x20; c < 0x7f; c++ )
        {
            font_weights[c][0] *= mult_total;
            for ( var i = 1; i < IMG2TXT_WEIGHT_COUNT; i++ )
                font_weights[c][i] *= mult_cell;
        }
    }

    function apply_fs(fdata, width, height, y, x, err)
    {
        if ( x < 0 || x + IMG2TXT_CHAR_W >= width
        || y < 0 || y + IMG2TXT_CHAR_H >= height )
            return;

        err /= IMG2TXT_PIXNUM;
        for ( var i = 0; i < IMG2TXT_CHAR_H; i++ )
            for ( var j = 0; j < IMG2TXT_CHAR_W; j++ )
                fdata[(y + i) * width + (x + j)] += err;
    }

    function img2txt(canvas, footer, factor)
    {
        if ( factor === undefined )
            factor = 6.0;

        var txt = "";
        ctx = canvas.getContext('2d');

        var height = canvas.height;
        var width = canvas.width;

        var image_data = ctx.getImageData(0, 0, width, height);
        var data = image_data.data;

        var fdata = new Float32Array(data.length / 4);
        for ( var i = 0; i < data.length / 4; i++ )
            fdata[i] = 255 - data[i * 4];

        for ( var y = 0; y + IMG2TXT_CHAR_H <= height; y += IMG2TXT_CHAR_H )
        {
            for ( var x = 0; x + IMG2TXT_CHAR_W <= width; x += IMG2TXT_CHAR_W )
            {
                var pix_data = new Float32Array(IMG2TXT_WEIGHT_COUNT);
                for ( var i = 0; i < IMG2TXT_CHAR_H; i++ )
                {
                    for ( var j = 0; j < IMG2TXT_CHAR_W; j++ )
                    {
                        var val = fdata[(y + i) * width + (x + j)];
                        pix_data[0] += val;
                        pix_data[1 + i * IMG2TXT_CHAR_W + j] = val;
                    }
                }

                pix_data[0] /= IMG2TXT_PIXNUM;

                var best = 9999999999999999.;
                var best_z = 0x20;
                for ( var z = 0x20; z < 0x7f; z++ )
                {
                    var fweight = font_weights[z];
                    var val = pix_data[0] - fweight[0];
                    var ssd = factor * val * val;
                    for ( var i = 1; i < IMG2TXT_WEIGHT_COUNT; i++ )
                    {
                        val = pix_data[i] - fweight[i];
                        ssd += val * val;
                    }
                    if ( ssd < best )
                    {
                        best = ssd;
                        best_z = z;
                    }
                }
                txt += String.fromCharCode(best_z);

                // floyd-steinberg
                var cell_diff = pix_data[0] - font_weights[best_z][0];
                apply_fs(fdata, width, height, y                 , x + IMG2TXT_CHAR_W, cell_diff * 7. / 16.);
                apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x - IMG2TXT_CHAR_W, cell_diff * 3. / 16.);
                apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x                 , cell_diff * 5. / 16.);
                apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x + IMG2TXT_CHAR_W, cell_diff * 1. / 16.);
            }
            txt += '\n';
        }

        if ( footer )
        {
            var footer_lines = footer.split('\n');
            var txt_lines = txt.split('\n');

            // calculate line length
            var line_length = 0;
            footer_lines.forEach(function(line) {
                if ( line_length < line.length )
                    line_length = line.length;
            });

            // fill lines
            footer_lines.unshift("")
            footer_lines.push("")
            footer_lines = footer_lines.map(line => " " + line + " ".repeat(1 + line_length - line.length));

            var txt_line_length = txt_lines[0].length;
            var start_i = txt_line_length - line_length - 4;
            var end_i = txt_line_length - 2;

            // replace txt
            footer_lines.reverse();
            var idx = 0;
            footer_lines.forEach(function(line) {
                var lidx = txt_lines.length - 1 - 2 - idx;
                var txt_line = txt_lines[lidx];
                txt_lines[lidx] = txt_line.substr(0, start_i) + line + txt_line.substr(end_i);
                idx += 1;
            });

            txt = txt_lines.join('\n');
        }

        return txt;
    }

    function txt2img(canvas, txt)
    {
        ctx = canvas.getContext('2d');
        for ( var y = 0, ylen = txt.length; y < ylen; y++ )
        {
            for ( var x = 0, xlen = txt[y].length; x < xlen; x++ )
            {
                var idx = txt[y][x].charCodeAt();
                var sx = font_offsets[idx][0];
                var sy = font_offsets[idx][1];
                var sw = TXT2IMG_CHAR_W;
                var sh = TXT2IMG_CHAR_H;
                var dx = x * sw;
                var dy = y * sh;
                ctx.drawImage(font_image, sx, sy, sw, sh, dx, dy, sw, sh);
            }
        }
    }

    prepare_font();
    fix_weights();

    this.img2txt = img2txt;
    this.txt2img = txt2img;
}

function load()
{
    function iso_date_time()
    {
        function zero_pad(v)
        {
            var str = "";
            if ( v < 10 )
                str = "0";
            return str + v;
        }
        var date = new Date();
        var str = "" + date.getFullYear();
        str += '-' + zero_pad(date.getMonth());
        str += '-' + zero_pad(date.getDay());
        str += ' ' + zero_pad(date.getHours());
        str += ':' + zero_pad(date.getMinutes());
        return str;
    }

    var footer = "ASCIIMATON - lghs.be\n\n  " + iso_date_time();

    var font = document.getElementById('font');
    var conv = new ascii_conv(font);

    var img = document.getElementById('lena');
    var canvas = document.createElement('canvas');
    canvas.height = img.height;
    canvas.width = img.width;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // conv.txt2img(canvas, txt);
    txt = conv.img2txt(canvas, footer, 1./6.);
}
window.onload = load;
