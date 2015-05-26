// orbit: [[distance, speed], ...]
var allOrbits = [
    [[220, 1], [400, -1]],
    [[220, 1], [200, -2]],
    [[42,2],   [185,-1]],
    [[281,3],  [170,-2]],
    [[265,1],  [35,-6]],
    [[204,3],  [295,-2]],
    [[154,-6], [148,3]],
    [[209,3],  [272,-4]],
    [[279,-3], [93,5]],
    [[78,4],   [228,-3]],
    [[14,-6],  [271,3]],
    [[257,1],  [59,3]],
    [[117,5],  [185,-4]],
    [[62,1],   [265,-2]],
    [[22,5],   [156,1]],
        
    [[200,1],  [200,-7], [200,7]],
    [[7,-5],   [148,-3], [32,-6]],
    [[90,-3],  [200,-6], [54,0]],
    [[101,-6], [106,-6], [97,3]],
    [[139,-3], [160,4],  [259,3]],
    [[86,-1],  [177,3],  [219,-4]],
    [[210,-3], [222,2],  [105,1]],
    [[244,-1], [250,2],  [215,-3]],
    [[29,1],   [188,-1], [127,5]],
    [[179,-1], [78,1],   [42,4]],
    [[58,4],   [285,-3], [150,5]],
        
    [[214,-2], [156,4],  [216,1],  [248,-4]],
    [[88,4],   [272,-1], [172,0],  [186,1]],
    [[53,-4],  [263,-6], [82,5],   [218,3]],
    [[92,-5],  [256,-1], [57,-4],  [77,0]],
    [[41,1],   [205,-3], [218,5],  [95,-3]],
    [[113,-5], [254,4],  [136,5],  [294,-4]],
    [[75,-4],  [69,2],   [47,-5],  [36,3]],
    [[46,3],   [209,1],  [129,4],  [209,-3]],
    [[68,1],   [161,2],  [215,4],  [219,-4]],
    
    [[191,1],  [102,-3], [24,5],   [50,1],   [128,-2], [163,-3]],
    [[105,-6], [149,-4], [68,-5],  [191,2],  [37,-3],  [182,-3]],
    [[176,-2], [113,3],  [153,2],  [22,4],   [21,-1],  [4,3]],
    [[17,1],   [56,-1],  [29,2],   [3,2],    [23,-2],  [175,1]],
    [[141,-3], [78,4],   [174,2],  [90,5],   [30,-5],  [178,1]],
    [[102,1],  [128,0],  [87,3],   [131,-1], [86,4],   [52,0]],
    [[22,2],   [126,-1], [198,4],  [65,-2],  [27,-5],  [95,-3]],
    [[163,2],  [6,1],    [131,3],  [132,-1], [82,-5],  [128,-3]],
    [[107,-1], [180,1],  [24,4],   [85,-2],  [49,-1],  [191,3]],
    [[48,5],   [136,-4], [152,-4], [99,5],   [88,1],   [7,5]],
    [[149,1],  [38,1],   [152,4],  [150,5],  [178,-2], [120,-1]],
    [[31,-2],  [92,-1],  [40,4],   [46,2],   [194,-1], [26,-2]],
    [[144,2],  [101,-3], [125,1],[ 197,3],   [20,-1],  [38,-4]],
    [[168,-4], [9,-4],   [144,0],  [83,0],   [93,5],   [47,0]],
    [[34,-6],  [147,-1], [73,4],   [136,5],  [61,-1],  [9,4]],
    [[74,0],   [152,-1], [55,-5],  [143,-4], [123,4],  [128,2]],
    [[53,1],   [8,1],    [147,-4], [48,-6],  [144,-2], [167,5]],
    
    [[12,2],[40,-4],[19,-3],[20,1],[29,-3],[32,2],[48,2],[14,2],[9,-3],[19,-2],[17,-6],[49,-3],[18,4],[40,-6],[43,-2],[17,2],[18,4],[31,0],[22,-6],[34,2],[13,-1],[47,-2],[38,-4],[18,-6],[37,-1],[14,-2],[4,-6],[25,-1],[38,2],[21,4],[34,2],[27,1],[26,1],[40,2],[15,0],[46,3],[43,-6],[7,-3],[31,-2],[22,-3],[30,0],[35,4],[24,-3],[33,2],[8,3],[24,4],[13,0],[13,3],[43,-5],[25,-5]],
    
    [[19,3],[48,2],[11,-5],[11,1],[49,3],[22,4],[46,-1],[48,1],[26,-4],[13,-6],[23,3],[29,-1],[30,-3],[10,-3],[40,5],[3,-1],[21,0],[30,-4],[5,-3],[11,-6],[37,2],[21,-1],[45,-1],[39,4],[33,-1],[2,3],[43,-6],[12,-1],[17,-5],[21,-5],[16,4],[35,1],[29,-1],[38,3],[33,2],[44,5],[22,-1],[11,1],[6,3],[49,-5],[49,2],[11,-5],[4,4],[28,1],[1,2],[1,-6],[29,-4],[22,4],[21,2],[19,4]],
    
    [[22,2],[20,-1],[22,4],[44,-1],[36,3],[34,-3],[48,-2],[30,4],[46,5],[18,0],[43,-2],[24,-2],[12,-2],[35,-3],[43,2],[20,5],[17,-3],[45,5],[3,-3],[25,-2],[0,0],[22,-3],[6,1],[11,-4],[26,-2],[22,-1],[30,-1],[16,-6],[47,1],[42,4],[25,-5],[22,-2],[33,-5],[4,-2],[17,5],[21,-6],[47,-2],[48,5],[16,-6],[14,5],[29,-1],[17,2],[22,0],[6,-6],[35,3],[37,-1],[2,-6],[2,-3],[47,3],[8,-2]],
    
    [[4,3],[0,5],[38,-5],[43,1],[26,5],[33,0],[29,3],[20,0],[34,2],[41,2],[38,-2],[12,-2],[22,-4],[48,3],[30,1],[26,5],[6,-1],[17,-6],[8,-1],[15,0],[10,1],[22,1],[35,-4],[6,4],[40,2],[36,5],[43,-3],[5,3],[1,-1],[12,-6],[20,-6],[38,1],[42,-2],[23,-5],[22,-4],[38,2],[10,-4],[32,-3],[25,-6],[12,-3],[39,1],[7,-2],[2,-4],[21,1],[10,-4],[36,0],[41,5],[18,-2],[47,4],[1,-4]],
    
    [[11,-4],[21,0],[14,0],[19,-5],[22,-6],[42,-3],[45,2],[24,5],[28,3],[20,-1],[17,-2],[44,-2],[37,4],[6,-5],[35,1],[38,-1],[6,-2],[37,-4],[8,3],[9,-3],[48,3],[19,-2],[2,4],[46,3],[32,2],[30,3],[31,5],[28,5],[22,3],[12,0],[48,0],[29,-4],[47,2],[14,-5],[13,-5],[48,3],[26,2],[15,-5],[25,-3],[17,1],[10,3],[34,-4],[26,-4],[25,5],[14,1],[36,-3],[41,-6],[41,-3],[41,-4],[43,-5]]
];

var niceOrbits = [
    [[220, 1], [400, -1]],
    [[220, 1], [200, -2]],
    [[204,3],  [295,-2]],
    [[154,-6], [148,3]],
    [[209,3],  [272,-4]],
    [[78,4],   [228,-3]],
    
    [[200, 1], [200,-7], [200, 7]],
    [[90,-3],  [200,-6], [54,0]],
    [[210,-3], [222,2],  [105,1]],
    [[58,4],   [285,-3], [150,5]],
    
    [[214,-2], [156,4],  [216,1],  [248,-4]],
    [[53,-4],  [263,-6], [82,5],   [218,3]],
    [[92,-5],  [256,-1], [57,-4],  [77,0]],
    [[41,1],   [205,-3], [218,5],  [95,-3]],
    [[46,3],   [209,1],  [129,4],  [209,-3]],

    [[176,-2],[113,3],[153,2],[22,4],[21,-1],[4,3]],
    [[22,2],[126,-1],[198,4],[65,-2],[27,-5],[95,-3]],
    [[163,2],[6,1],[131,3],[132,-1],[82,-5],[128,-3]],
    [[48,5],[136,-4],[152,-4],[99,5],[88,1],[7,5]],
    [[31,-2],[92,-1],[40,4],[46,2],[194,-1],[26,-2]],
    [[34,-6],[147,-1],[73,4],[136,5],[61,-1],[9,4]]
];