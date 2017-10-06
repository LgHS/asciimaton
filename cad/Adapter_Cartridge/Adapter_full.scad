include <Adapter_config.scad>;

use <Adapter_right_int.scad>
use <Adapter_right_ext.scad>
use <Adapter_onglet.scad>

translate([-adaptateur_ep,0,0])
adaptateur_droit_int();

adaptateur_droit_ext();

translate([-(adaptateur_ep + onglet_ep + onglet_ec),adaptateur_pf,adaptateur_ht-onglet_ht])
rotate([0,0,-90])
adaptateur_onglet_droit();