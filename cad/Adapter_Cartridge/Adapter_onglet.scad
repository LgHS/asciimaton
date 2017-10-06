include <Adapter_config.scad>;

module adaptateur_onglet_droit()
{
    rect3_sx = adaptateur_pf-onglet_ep;
    rect3_sy = onglet_ep;
    rect3_sz = onglet_ht-onglet_ep/2;
    rect3_x = onglet_ep;
    rect3_y = 0;
    rect3_z = 0;

    rect4_sx = onglet_ep;
    rect4_sy = adaptateur_ep*2 + onglet_ep + onglet_ec;
    rect4_sz = onglet_ht;
    rect4_x = 0;
    rect4_y = 0;
    rect4_z = 0;

    cyl1_dm = onglet_ep;
    cyl1_ht = rect3_sx;

    union()
    {
        color("green")
        translate([rect3_x, rect3_y, rect3_z])
        cube([rect3_sx, rect3_sy, rect3_sz]);
        
        color("red")
        translate([rect4_x, rect4_y, rect4_z])
        cube([rect4_sx, rect4_sy, rect4_sz]);
        
        color("blue")
        translate([onglet_ep,onglet_ep/2,rect3_sz])
        rotate([0,90,0])
        cylinder(d=cyl1_dm, h=cyl1_ht);
    }
}

adaptateur_onglet_droit();