// 1.12+
module.exports = function (blockType,height){
		var color = [255,0,244];
		switch(parseInt(blockType)){
			default:
			//	console.log(blockType);
			color = [255/2,255/2,255/2];
			break;
			//Stone
			case 1: color=[100,100,100];
			break;
			//Grass
			case 2: color=[20,200,20];
			break;
			//Dirt
			case 3: color=[151,108,74];
			break;
			//Cobble
			case 4: color=[70,70,70];
			break;
			//Planks
			case 5: color=[212,178,0];
			break;
			//Bedrock
			case 7: color=[10,10,10];
			break;
			//Water
			case 9: color=[4,103,216];
			break;
			case 8: color=[4,103,255];
			break;
			//Lava
			case 10: color=[240,92,0];
			break;
			case 11: color=[250,80,0];
			break;
			//Sand
			case 12: color=[223,209,0];
			break;
			//Gravel
			case 13: color=[120,120,120];
			break;
			//Gold ore
			case 14: color=[247,219,37];
			break;
			//Iron ore
			case 15: color=[100,97,90];
			
			break;
			//Coal Ore
			case 16: color=[90,90,90];
			break;
			//Log
			case 17: color=[81,66,5];
			break;
			//Leaves
			case 18: color=[20,130,0];
			break;
			//Sponge
			case 19: color=[202,243,0];
			break;
			//Lapis ore
			case 21: color=[41,72,146];
			break;
			//Lapis block
			case 22: color=[74,119,225];
			break;
			//Dispenser
			case 23: color=[99,99,99];
			break;
			//Sandstone
			case 24: color=[200,180,0];
			break;
			//Bed
			case 25: color=[216,156,238];
			break;
			//Sticky piston
			case 29: color=[156,238,169];
			break;
			//piston
			case 33: color=[172,125,77];
			break;
			//piston head
			case 34: color=[172,159,77];
			break;
			//wool
			case 35: color=[236,236,236];
			break;
			//gold block
			case 41: color=[255,255,102];
			break;
			//iron block
			case 42: color=[218,218,218];
			break;
			//Double Stone slab
			case 43: color=[120,120,120];
			break;
			//Stone slab
			case 44: color=[120,120,120];
			break;
			//Brick block
			case 45: color=[137,14,14];
			break;
			//TNT
			case 46: color=[255,20,20];
			break;
			//bookshelf
			case 47: color=[142,95,55];
			break;
			//Cobble Mossy
			case 48: color=[70,120,70];
			break;
			//Obsidian
			case 49: color=[40,0,60];
			break;
			//Mob spawner 
			case 52: color=[55,133,142];
			break;
			//oak stairs 
			case 53: color=[212,178,0];
			break;
			//chest 
			case 54: color=[134,117,48];
			break;
			//Diamond ore
			case 56: color=[28,142,123];
			break;
			//Diamond block
			case 57: color=[38,235,202];
			break;
			//Crafting table
			case 58: color=[230,160,0];
			break;
			//Farmland 
			case 60: color=[137,121,58];
			break;
			//Furance
			case 61: color=[65,65,65];
			break;
			//Furance Lit
			case 62: color=[65,65,65];
			break;
			//Wood door 
			case 64: color=[180,150,0];
			break;
			//Ladder
			case 65: color=[180,150,0];
			break;
			//Stone stairs
			case 67: color=[90,90,90];
			break;
			//iron door
			case 71: color=[218,218,218];
			break;
			//redstone ore
			case 73: color=[202,76,76];
			break;
			//redstone ore lit
			case 73: color=[202,76,76];
			break;
			//Snow_layer
			case 78: color=[255,255,255];
			break;
			//Ice
			case 79: color=[0,222,255];
			break;
			//Snow
			case 80: color=[255,255,255];
			break;
			//Cactus
			case 81: color=[13,105,62];
			break;
			//Clay
			case 82: color=[116,120,125];
			break;
			//Jukebox
			case 84: color=[135,88,34];
			break;
			//Fence
			case 85: color=[208,162,110];
			break;
			//Pumpkin
			case 86: color=[255,146,21];
			break;
			//Netherrack
			case 87: color=[120,0,0];
			break;
			//Soul sand
			case 88: color=[41,38,0];
			break;
			//Glowstone
			case 89: color=[242,231,83];
			break;
			//Pumpkin Lit
			case 91: color=[255,146,21];
			break;
			//Cake
			case 92: color=[253,198,256];
			break;
			//Repeater
			case 93: color=[183,19,63];
			break;
			//Repeater
			case 94: color=[232,36,88];
			break;
			//Trap door
			case 96: color=[204,153,51];
			break;
			//Stone brick
			case 98: color=[105,105,105];
			break;
			//Brown Mushroom
			case 99: color=[195,174,77];
			break;
			//Red Mushroom
			case 100: Math.random() < 0.7 ? color=[202,22,27] : color=[255,231,232]; 
			break;
			//Iron bars
			case 101:  color=[190,190,190]; 
			break;
			//Melon blocks
			case 103:  color=[31,124,28]; 
			break;
			//Pumpkin stem
			case 104:  color=[201,162,9]; 
			break;
			//Melon stem
			case 105:  color=[3,82,8]; 
			break;
			//Fence gate
			case 107:  color=[158,119,41]; 
			break;
			//Brick stairs
			case 108: color=[137,14,14];
			break;
			//Stone brick stairs
			case 109: color=[120,120,120];
			break;
			//mycelium
			case 110: color=[193,149,59];
			break;
			//waterlily
			case 111: color=[70,174,77];
			break;
			//Nether brick
			case 112: color=[70,0,0];
			break;
			//Nether brick fence
			case 112: color=[60,0,0];
			break;
			//Nether brick stairs
			case 113: color=[60,0,0];
			break;
			//Enchantment table
			case 116: color=[125,53,144];
			break;
			//Brewing stand
			case 117: color=[165,152,168];
			break;
			//Cauldron
			case 118: color=[100,97,101];
			break;
			//End portal 
			case 119: color=[232,193,242];
			break;
			//End portal frame
			case 120: color=[203,208,140];
			break;
			//End Stone
			case 121: color=[240,249,116];
			break;
			//Redstone lamp
			case 123: color=[135,56,77];
			break;
			//Redstone lamp lit
			case 124: color=[238,59,107];
			break;
			//Wood slab
			case 126: color=[222,198,0];
			break;
			//Sandstone stairs
			case 128: color=[180,160,0];
			break;
			//Emerald ore
			case 129: color=[60,92,68];
			break;
			//E-chest
			case 130: color=[120,0,130];
			break;
			//Emerald Block
			case 133: color=[54,233,96];
			break;
			//Spruce stairs
			case 134: color=[110,48,48];
			break;
			//Birch stairs
			case 135: color=[195,209,141];
			break;
			//Jungle stairs
			case 136: color=[154,81,50];
			break;
			//Beacon
			case 138: color=[96,178,233];
			break;
			//Cobble Wall
			case 139: color=[85,85,85];
			break;
			//Flowerpot
			case 140: color=[107,78,21];
			break;
			//Anvil
			case 145: color=[81,81,81];
			break;
			//chest trapped
			case 146: color=[154,117,48];
			break;
			//redstone block
			case 152: color=[246,40,47];
			break;
			//quartz ore
			case 153: color=[169,87,90];
			break;
			//Hopper
			case 154: color=[134,128,129];
			break;
			//Quartz block
			case 155: color=[229,225,225];
			break;
			//Quartz stairs
			case 156: color=[202,196,197];
			break;
			//Dropper
			case 158: color=[151,152,143];
			break;
			//Stained clay
			case 159: color=[208,113,116];
			break;
			//Leaves2
			case 161: color=[30,80,40];
			break
			//log2
			case 162: color=[125,68,29];
			break
			//acacia stairs
			case 163: color=[198,113,56];
			break
			//dark oak stairs
			case 164: color=[88,53,29];
			break
			//slime
			case 165: color=[104,201,20];
			break
			//iron_trapdoor
			case 167: color=[205,205,205];
			break
			//prismarine
			case 168: color=[62,189,138];
			break
			//sea lantern
			case 169: color=[97,219,170];
			break
			//hay block
			case 170: color=[216,185,61];
			break
			//carpet
			case 171: color=[0,255,0];
			break
			//hardened clay
			case 172: color=[206,123,87];
			break
			//coal block
			case 173: color=[0,0,0];
			break
			//Packed ice
			case 174: color=[0,200,255];
			break;
			//Red standstone
			case 179: color=[232,81,17];
			break;
			//Red standstone stairs
			case 180: color=[200,81,17];
			break;
			//Double Stone slab2
			case 181: color=[200,120,120];
			break;
			//Stone slab 2
			case 182: color=[200,120,120];
			break;
			//Spruce gate
			case 183: color=[110,48,48];
			break;
			//Birch gate
			case 184: color=[195,209,141];
			break;			
			//Jungle gate
			case 185: color=[154,81,50];
			break;			
			//dark oak gate
			case 186: color=[88,53,29];
			break
			//acacia gate
			case 187: color=[198,113,56];
			break
			

			//Spruce fence
			case 188: color=[110,48,48];
			break;
			//Birch fence
			case 189: color=[195,209,141];
			break;			
			//Jungle fence
			case 190: color=[154,81,50];
			break;			
			//dark oak fence
			case 191: color=[88,53,29];
			break
			//acacia fence
			case 192: color=[198,113,56];
			break

	

			//Spruce door
			case 193: color=[120,58,58];
			break;
			//Birch door
			case 194: color=[205,219,151];
			break;			
			//Jungle door
			case 195: color=[164,91,60];
			break;			
			//acacia door
			case 196: color=[208,123,66];
			break
			//dark oak door
			case 197: color=[98,63,39];
			break

		
			//End rod
			case 198: color=[232,201,225];
			break
			
			//Purpur
			case 201: color=[229,155,212];
			break
			//Purpur
			case 202: color=[229,155,212];
			break
			//Purpur
			case 203: color=[229,155,212];
			break
			//Purpur
			case 204: color=[229,155,212];
			break
			//Purpur
			case 205: color=[229,155,212];
			break
						
				
			//End bricks
			case 206: color=[180,160,0];
			break;
			//Grass path 
			case 208: color=[150,130,70];
			break;
			//Ice Frosted
			case 212: color=[0,250,200];
			break;
			//Magma
			case 213: color=[209,106,27];
			break;
			//Nether wart block
			case 214: color=[159,10,10];
			break;
			//red nether brick
			case 215: color=[100,0,0];
			break;
			//bone block
			case 216: color=[250,249,203];
			break;			
			//Observer
			case 218: color=[150,150,150];
			break;
			
			//Shulkers
			case 219: color=[255,255,255];
			break;	
			case 220: color=[232,140,70];
			break;		
			case 221: color=[232,70,226];
			break;		
			case 222: color=[8,230,238];
			break;		
			case 223: color=[256,224,26];
			break;		
			case 224: color=[26,246,58];
			break;		
			case 225: color=[242,185,227];
			break;		
			case 226: color=[102,93,100];
			break;		
			case 227: color=[183,171,180];
			break;					
			case 228: color=[69,135,129];
			break;				
			case 229: color=[120,69,135];
			break;				
			case 230: color=[23,5,185];
			break;				
			case 231: color=[125,73,14];
			break;	
			case 232: color=[30,94,28];
			break;	
			case 233: color=[165,28,33];
			break;	
			case 234: color=[60,53,53];
			break;	
			
			
			case 235: color=[255,255,255];
			break;	
			case 236: color=[232,140,70];
			break;		
			case 237: color=[232,70,226];
			break;		
			case 238: color=[8,230,238];
			break;		
			case 239: color=[256,224,26];
			break;		
			case 240: color=[26,246,58];
			break;		
			case 241: color=[242,185,227];
			break;		
			case 242: color=[102,93,100];
			break;		
			case 243: color=[183,171,180];
			break;					
			case 244: color=[69,135,129];
			break;				
			case 245: color=[120,69,135];
			break;				
			case 246: color=[23,5,185];
			break;				
			case 247: color=[125,73,14];
			break;	
			case 248: color=[30,94,28];
			break;	
			case 249: color=[165,28,33];
			break;	
			case 250: color=[60,53,53];
			break;	
			
			//Concrete
			case 251: color=[170,170,170];
			break;
			//Concrete Powder
			case 252: color=[170,170,170];
			break;
			
		}
		let colorMix = Math.max(Math.min(height/125,1),0);
		color = [color[0] * colorMix, color[1] * colorMix, color[2] * colorMix];
		return(color);
}
