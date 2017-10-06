difference()
{
    // translate y 16
    translate([0,0,13])
    rotate([0,90,0])
    import("carriage1.stl");
    
    color("red")
    translate([0,0,-25])
    cube([80,80,25]);
    
    translate([0,25.5,3.12])
    cube([57,16.5,10]);
    
    translate([28.5,34,-0.5])
    cylinder(h=17, d1=22, d2=26);
}