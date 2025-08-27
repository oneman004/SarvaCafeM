import plainFriesImg from "../assets/images/plain-fries.webp";
import periFriesImg from "../assets/images/periperi-fries.webp";
import cheesyFriesImg from "../assets/images/cheesy-fries.webp";
import shahi_dahi_ke_kebabImg from "../assets/images/shahi-dahi-ke-kebab.webp";
import palak_kabuli_cheese_tikkiImg from "../assets/images/palak-kabuli-cheese-tikki.webp";
import beet_ki_galouti_kebabImg from "../assets/images/beet-ki-galouti-kebab.webp";
import tandoori_soya_chaapImg from "../assets/images/tandoori-soya-chaap.webp";
import veg_crispyImg from "../assets/images/veg-crispy.webp";
import namaste_kharda_paneerImg from "../assets/images/namaste-kharda-paneer.webp";
import corn_cheese_ballsImg from "../assets/images/corn-cheese-balls.webp";
import classic_paneer_chilliImg from "../assets/images/classic-paneer-chilli.webp";
import peri_peri_momosImg from "../assets/images/peri-peri-momos.webp";
import palak_patta_chaat_chef_specialImg from "../assets/images/palak-patta-chaat.webp";
import matka_afghani_paneerImg from "../assets/images/matka-afghani-paneer.webp";
import classic_paneer_tikkaImg from "../assets/images/classic-paneer-tikka.webp";
import creamy_malai_tikkaImg from "../assets/images/creamy-malai-tikka.webp";
import soti_boti_paneerImg from "../assets/images/soti-boti-paneer.webp";
import tandoori_mushroomImg from "../assets/images/tandoori-mushroom.webp";
import tandoori_soya_chaap_specialImg from "../assets/images/tandoori-soya-chaap.webp";
import veg_manchurian_dryImg from "../assets/images/veg-manchurian-dry.webp";
import tandoori_hariyali_seekhImg from "../assets/images/tandoori-hariyali-seekh.webp";
//new ones
import vegSandwichImg from "../assets/images/veg-sandwich.webp";
import paneerJungleeSandwichImg from "../assets/images/paneer-junglee-sandwich.jpg";
import mumbaiSandwichImg from "../assets/images/mumbai-sandwich.jpeg";
import tandulachaWadaPavImg from "../assets/images/tandulacha-wada-pav.jpg";
import glutenFreeDosaiImg from "../assets/images/gluten-free-dosai.webp";
import kothimbirWadiImg from "../assets/images/kothimbir-wadi.webp";
import bombayPavBhajiImg from "../assets/images/bombay-pav-bhaji.webp";
import pizzaBombImg from "../assets/images/pizza-bomb.webp";
import miniBatataWadaImg from "../assets/images/mini-batata-wada.webp";
import appeChutneyImg from "../assets/images/appe-chutney.webp";
import namasteMisalPavImg from "../assets/images/namaste-misal-pav-dahi.jpeg";
import cholaKulchaImg from "../assets/images/chola-kulcha.avif";
import rajmaChawalImg from "../assets/images/rajma-chawal.jpeg";
import dalMakhniJeeraRiceImg from "../assets/images/dal-makhni-jeera-rice.jpeg";
import vegKormaParathaImg from "../assets/images/veg-korma-malbori-paratha.jpeg";
import dalKhichadiDahiImg from "../assets/images/dal-fry-rice-khichdi-dahi.jpg";
import schezwanRiceManchurianImg from "../assets/images/schezwan-rice-manchurian.jpg";





const menuItems = [

     { name: "Veg Sandwich", price: 89, category: "All Time Hit", image: vegSandwichImg },
  { name: "Paneer Junglee Sandwich", price: 89, category: "All Time Hit", image: paneerJungleeSandwichImg },
  { name: "Mumbai Sandwich", price: 89, category: "All Time Hit", image: mumbaiSandwichImg },
  { name: "Terra Wada Pav", price: 49, category: "All Time Hit", image: tandulachaWadaPavImg },
  { name: "Gluten Free Dosai", price: 89, category: "All Time Hit", image: glutenFreeDosaiImg },
  { name: "Kothimbir Wadi", price: 69, category: "All Time Hit", image: kothimbirWadiImg },
  { name: "Bombay Pav Bhaji", price: 99, category: "All Time Hit", image: bombayPavBhajiImg },
  { name: "Pizza Bomb", price: 79, category: "All Time Hit", image: pizzaBombImg },
  { name: "Mini Batata Wada", price: 49, category: "All Time Hit", image: miniBatataWadaImg },
  { name: "Appe & Chutney", price: 69, category: "All Time Hit", image: appeChutneyImg },
  { name: "namaste misal pav & dahi", price: 99, category: "Mini Thali", image: namasteMisalPavImg },
  { name: "chola kulcha", price: 99, category: "Mini Thali", image: cholaKulchaImg },
  { name: "rajma chawal", price: 99, category: "Mini Thali", image: rajmaChawalImg },
  { name: "dal makhni jeera rice", price: 99, category: "Mini Thali", image: dalMakhniJeeraRiceImg },
  { name: "veg korma & malbori paratha", price: 99, category: "Mini Thali", image: vegKormaParathaImg },
  { name: "dal fry rice / dal khichadi dahi", price: 89, category: "Mini Thali", image: dalKhichadiDahiImg },
  { name: "schezwan rice & manchurian", price: 99, category: "Mini Thali", image: schezwanRiceManchurianImg },




  /*
  // 🍟 FRIES
  { name: "Plain Fries", price: 100, category: "Fries", image: plainFriesImg },
{ name: "Peri Peri Fries", price: 120, category: "Fries", image: periFriesImg },
{ name: "Cheesy Fries", price: 140, category: "Fries", image: cheesyFriesImg },


  // 🌟 VEG STARTERS
{ name: "Shahi Dahi Ke Kebab", price: 220, category: "Veg Starters", image: shahi_dahi_ke_kebabImg },
{ name: "Palak Kabuli Cheese Tikki", price: 180, category: "Veg Starters", image: palak_kabuli_cheese_tikkiImg },
{ name: "Beet Ki Galouti Kebab", price: 210, category: "Veg Starters", image: beet_ki_galouti_kebabImg },
{ name: "Tandoori Soya Chaap", price: 220, category: "Veg Starters", image: tandoori_soya_chaapImg },
{ name: "Veg Crispy", price: 210, category: "Veg Starters", image: veg_crispyImg },
{ name: "Namaste Kharda Paneer", price: 220, category: "Veg Starters", image: namaste_kharda_paneerImg },
{ name: "Corn Cheese Balls", price: 155, category: "Veg Starters", image: corn_cheese_ballsImg },
{ name: "KurKure Aloo Chola Tikki Chaat", price: 210, category: "Veg Starters" },
{ name: "Classic Paneer Chilli", price: 190, category: "Veg Starters", image: classic_paneer_chilliImg },
{ name: "Peri Peri Momos", price: 230, category: "Veg Starters", image: peri_peri_momosImg },
{ name: "Palak Patta Chaat (Chef Special)", price: 160, category: "Veg Starters", image: palak_patta_chaat_chef_specialImg },


 // 🔥 TANDOOR SPECIALS
{ name: "Matka Afghani Paneer", price: 230, category: "Tandoor Specials", image: matka_afghani_paneerImg },
{ name: "Classic Paneer Tikka", price: 230, category: "Tandoor Specials", image: classic_paneer_tikkaImg },
{ name: "Creamy Malai Tikka", price: 230, category: "Tandoor Specials", image: creamy_malai_tikkaImg },
{ name: "Soti-Boti Paneer", price: 230, category: "Tandoor Specials", image: soti_boti_paneerImg },
{ name: "Tandoori Mushroom", price: 230, category: "Tandoor Specials", image: tandoori_mushroomImg },
{ name: "Tandoori Soya Chaap", price: 230, category: "Tandoor Specials", image: tandoori_soya_chaap_specialImg },
{ name: "Veg Manchurian Dry", price: 190, category: "Tandoor Specials", image: veg_manchurian_dryImg },
{ name: "Tandoori Hariyali Seekh", price: 230, category: "Tandoor Specials", image: tandoori_hariyali_seekhImg },


  // 🍛 MAHARASHTRIAN MAIN COURSE
  { name: "Matki Rassa", price: 185, category: "Maharashtrian" },
  { name: "Masala Vangi", price: 185, category: "Maharashtrian" },
  { name: "Kolhapuri Tawa Bhaji", price: 199, category: "Maharashtrian" },
  { name: "Aamti Bhaji", price: 199, category: "Maharashtrian" },
  { name: "Aakha Masoor Masala", price: 190, category: "Maharashtrian" },
  { name: "Dubuk Wade", price: 190, category: "Maharashtrian" },
  { name: "Patodi Rassa", price: 190, category: "Maharashtrian" },
  { name: "Shev Bhaji", price: 170, category: "Maharashtrian" },
  { name: "Shevga Kala Masala", price: 170, category: "Maharashtrian" },
  { name: "Pithla", price: 185, category: "Maharashtrian" },
  { name: "Kadhi Bhaji", price: 185, category: "Maharashtrian" },

  // 🍲 PUNJABI / NORTH INDIAN
  { name: "Tawa Veg", price: 270, category: "Punjabi" },
  { name: "Aloo Gobi Mutter", price: 270, category: "Punjabi" },
  { name: "Veg Hyderabadi", price: 270, category: "Punjabi" },
  { name: "Kolhapuri Kadai", price: 270, category: "Punjabi" },
  { name: "Soya Chaap Masala", price: 270, category: "Punjabi" },
  { name: "Methi Malai Mutter", price: 250, category: "Punjabi" },
  { name: "Mushroom Masala", price: 250, category: "Punjabi" },
  { name: "Kaju Paneer Masala", price: 299, category: "Punjabi" },
  { name: "Paneer Kadhai", price: 299, category: "Punjabi" },

  // 🧀 PANEER SPECIALS
  { name: "Paneer Butter Makhani", price: 280, category: "Paneer Specials" },
  { name: "Paneer Lababdar", price: 280, category: "Paneer Specials" },
  { name: "Rajwadi Paneer Tikka Masala", price: 290, category: "Paneer Specials" },
  { name: "Jodhpuri Paneer Tikka Masala", price: 290, category: "Paneer Specials" },
  { name: "Paneer Khurchan Bhurji", price: 270, category: "Paneer Specials" },
  { name: "Paneer Rizala", price: 270, category: "Paneer Specials" },
  { name: "Paneer Tawa", price: 270, category: "Paneer Specials" },
  { name: "Paneer Patiala", price: 270, category: "Paneer Specials" },
  { name: "Malai Kofta Gul Dasta", price: 290, category: "Paneer Specials" },
  { name: "Paneer Wrapped in Papad", price: 260, category: "Paneer Specials" },
  { name: "Paneer Kofta Sadabahar", price: 240, category: "Paneer Specials" },

  // 🍚 RICE
  { name: "Steam Rice", price: 180, category: "Rice" },
  { name: "Jeera Rice", price: 180, category: "Rice" },
  { name: "Veg Pulav", price: 180, category: "Rice" },
  { name: "Dal Khichadi", price: 190, category: "Rice" },
  { name: "Aakha Masoor Khichadi", price: 190, category: "Rice" },
  { name: "Tadka Dal + Jeera Rice Thali", price: 149, category: "Rice" },
  { name: "Khichadi Combo", price: 149, category: "Rice" },

  // 🫓 ROTI
  { name: "Tandoori Roti", price: 40, category: "Roti" },
  { name: "Chapati", price: 40, category: "Roti" },
  { name: "Naan", price: 40, category: "Roti" },
  { name: "Paratha", price: 40, category: "Roti" },
  { name: "Bhakri", price: 40, category: "Roti" },
  { name: "Extra Chapati", price: 25, category: "Roti" },
  { name: "Extra Bhakri", price: 25, category: "Roti" },
  { name: "Extra Paratha", price: 25, category: "Roti" },

  // 🍲 DAL
  { name: "Dal Tadka", price: 210, category: "Dal" },
  { name: "Dal Makhani", price: 210, category: "Dal" },
  { name: "Palak Dal Fry", price: 190, category: "Dal" },
  { name: "Chole Masala", price: 210, category: "Dal" },

  // 🍜 CHINESE / SIZZLERS
  { name: "Triple Schezwan", price: 230, category: "Chinese" },
  { name: "Fried Rice", price: 230, category: "Chinese" },
  { name: "Hakka Noodles", price: 230, category: "Chinese" },
  { name: "Chilli Garlic Noodles", price: 235, category: "Chinese" },
  { name: "Manchurian Pot Rice", price: 235, category: "Chinese" },
  { name: "Paneer Tikka Sizzler", price: 295, category: "Chinese" },
  { name: "Peri Peri Sizzler", price: 295, category: "Chinese" },
  { name: "Satellite Sizzler", price: 295, category: "Chinese" },
  { name: "Singapore Noodles", price: 285, category: "Chinese" },
  { name: "Chop Suey", price: 285, category: "Chinese" },

  // 🍱 THALI / COMBOS
  { name: "Shev Bhaji Thali", price: 159, category: "Thali" },
  { name: "Patodi Rassa Thali", price: 159, category: "Thali" },
  { name: "Kolhapuri Veg Thali", price: 159, category: "Thali" },
  { name: "Chole Bhature Thali", price: 149, category: "Thali" },
  { name: "Mutter Paneer Thali", price: 149, category: "Thali" },
  { name: "Aloo Paratha Dahi", price: 149, category: "Thali" },

  // 🍨 DESSERTS / SWEETS
  { name: "Gulab Jamun with Vanilla Ice Cream", price: 110, category: "Desserts" },
  { name: "Sizzling Brownie with Ice Cream", price: 150, category: "Desserts" },
  { name: "Shahi Gulkand Ice Cream", price: 130, category: "Desserts" },
  { name: "Peru Spice Ice Cream (Chef Special)", price: 130, category: "Desserts" },

  // 🥤 BEVERAGES
  { name: "Chaas", price: 55, category: "Beverages" },
  { name: "Nimbu Pani", price: 65, category: "Beverages" },
  { name: "Dahi", price: 35, category: "Beverages" },
  */
];
export default menuItems;
