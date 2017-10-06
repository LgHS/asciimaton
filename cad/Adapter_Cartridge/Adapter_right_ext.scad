include <Adapter_config.scad>;

module adaptateur_droit_ext()
{
    rect1_sx = 3;
    rect1_sy = 5.3;
    rect1_sz = 8;
    rect1_att_ht = 9.7;
    rect1_att_dc = -2.6;

    rect2_sx = 3;
    rect2_sy = 5.3;
    rect2_sz = 8;
    rect2_att_ht = 72.5;
    rect2_att_dc = -2.6;

    union()
    {
        difference()
        {
            cube([adaptateur_ep, adaptateur_pf, adaptateur_ht]);
            
            color("orange")
            translate([-0.1,adaptateur_pf-onglet_ep,adaptateur_ht-onglet_ht])
            cube([adaptateur_ep+0.2,onglet_ep+0.1,onglet_ht+0.1]);
        }
        translate([adaptateur_ep, adaptateur_pf/2-rect1_sy/2+rect1_att_dc, rect1_att_ht])
        cube([rect1_sx, rect1_sy, rect1_sz]);
        
        translate([adaptateur_ep, adaptateur_pf/2-rect2_sy/2+rect2_att_dc, rect2_att_ht])
        cube([rect2_sx, rect2_sy, rect2_sz]);
    }
}

adaptateur_droit_ext();