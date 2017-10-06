include <Adapter_config.scad>;

module adaptateur_droit_int()
{
    cyl1_dm = 4;
    cyl1_ht = 6;
    cyl1_att_ht = 3;
    cyl1_att_dc = 0;

    cyl2_dm = 5;
    cyl2_ht = 4;
    cyl2_att_ht = 28;
    cyl2_att_dc = 3;

    union()
    {
        difference()
        {
            cube([adaptateur_ep, adaptateur_pf, adaptateur_ht]);
            
            color("orange")
            translate([-0.1,adaptateur_pf-onglet_ep,adaptateur_ht-onglet_ht])
            cube([adaptateur_ep+0.2,onglet_ep+0.1,onglet_ht+0.1]);
        }
        
        color("black")
        translate([-cyl1_ht+0.1,adaptateur_pf/2+cyl1_att_dc,cyl1_att_ht])
        rotate([0,90,0])
        cylinder(d=cyl1_dm, h=cyl1_ht);
        
        color("blue")
        translate([-cyl2_ht+0.1,adaptateur_pf/2+cyl2_att_dc,cyl2_att_ht])
        rotate([0,90,0])
        cylinder(d=cyl2_dm, h=cyl2_ht);
    }
}

adaptateur_droit_int();