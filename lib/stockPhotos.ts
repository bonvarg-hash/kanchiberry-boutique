/**
 * Openly licensed saree photographs from Wikimedia Commons (fabric only, no
 * models), used as representative images for sample listings that have no
 * photography of their own. Each is credited on the saree's page. Replace with
 * the boutique's own photographs before launch.
 *
 * view: what the photo shows (opened out, pallu, motif, border, folded, detail).
 * weave / family: the closest weave and colour family, used to match listings.
 */
export interface StockPhoto {
  src: string;
  weave: string;
  family: string;
  view: "opened" | "pallu" | "motif" | "border" | "folded" | "detail";
  label: string;
  credit: string;
  source: string;
}

export const STOCK_PHOTOS: StockPhoto[] = [
  { src: "/photos/commons/c01.jpg", weave: "banarasi", family: "Orange", view: "motif", label: "Motif", credit: "Salisiva, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:SAREE.jpg" },
  { src: "/photos/commons/c02.jpg", weave: "patola", family: "Red", view: "pallu", label: "Pallu", credit: "Rahul191313, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sambalpuri_saree_pallu.jpg" },
  { src: "/photos/commons/c05.jpg", weave: "banarasi", family: "Black", view: "motif", label: "Motif", credit: "Unknown author, Public domain, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:'Sari'_from_Varanasi_(north-central_India),_silk_and_gold-wrapped_silk_yarn_with_supplementary_weft_brocade.jpg" },
  { src: "/photos/commons/c06.jpg", weave: "banarasi", family: "Red", view: "folded", label: "Folded", credit: "Suyash Dwivedi, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Banarasi_Sari_on_viewing_wooden_blocks_01.jpg" },
  { src: "/photos/commons/c07.jpg", weave: "banarasi", family: "Red", view: "pallu", label: "Pallu", credit: "User:आशीष भटनागर, Public domain, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Banarasi_sari_pallu_by_ashish4.JPG" },
  { src: "/photos/commons/c08.jpg", weave: "kanjivaram", family: "Yellow", view: "detail", label: "Detail", credit: "Sindugab, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Indian_Saree_kuchu_knots.jpg" },
  { src: "/photos/commons/c09.jpg", weave: "banarasi", family: "Purple", view: "motif", label: "Motif", credit: "Anilbhardwajnoida, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Konia,_brocade_sari.jpg" },
  { src: "/photos/commons/c10.jpg", weave: "linen-cotton", family: "Ivory", view: "motif", label: "Motif", credit: "Kiransboutique, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Kota-doria-saree-15.jpg" },
  { src: "/photos/commons/c12.jpg", weave: "kanjivaram", family: "Yellow", view: "folded", label: "Folded", credit: "Deepana, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Saree29.jpg" },
  { src: "/photos/commons/c15.jpg", weave: "banarasi", family: "Ivory", view: "opened", label: "Opened out", credit: "Daderot, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari,_Varanasi,_Uttar_Pradesh,_India,_1960s,_silk,_gold_thread,_satin_-_Textile_Museum_of_Canada_-_DSC00943.JPG" },
  { src: "/photos/commons/c16.jpg", weave: "banarasi", family: "Purple", view: "opened", label: "Opened out", credit: "Daderot, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari,_Varanasi,_Uttar_Pradesh,_India,_view_1,_20th_century,_silk,_gold_thread_-_Textile_Museum_of_Canada_-_DSC00954.JPG" },
  { src: "/photos/commons/c17.jpg", weave: "banarasi", family: "Purple", view: "motif", label: "Motif", credit: "Daderot, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari,_Varanasi,_Uttar_Pradesh,_India,_view_2,_20th_century,_silk,_gold_thread_-_Textile_Museum_of_Canada_-_DSC00956.JPG" },
  { src: "/photos/commons/c19.jpg", weave: "banarasi", family: "Red", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_India,_Varanasi,_18th_century,_Honolulu_Museum_of_Art_10911.1.JPG" },
  { src: "/photos/commons/c20.jpg", weave: "banarasi", family: "Yellow", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_India_(probably_Benares),_late_19th_or_early_20th_century,_silk_with_metallic_thread,_HAA.jpg" },
  { src: "/photos/commons/c21.jpg", weave: "patola", family: "Black", view: "motif", label: "Motif", credit: "Unknown author, Public domain, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:'Patola'_(ritual_heirloom_cloth)_from_Gujarat,_India,_late_18th_or_early_19th_century.jpg" },
  { src: "/photos/commons/c22.jpg", weave: "patola", family: "Red", view: "motif", label: "Motif", credit: "Jainamishra, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Antique_Patan_Patola_Double_Ikat_Trade_Textile_courtesy_Wovensouls_Collection,_Singapore.jpg" },
  { src: "/photos/commons/c23.jpg", weave: "patola", family: "Red", view: "opened", label: "Opened out", credit: "Unknown artistUnknown artist, Public domain, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Patola_(India),_19th_century_(CH_18437535).jpg" },
  { src: "/photos/commons/c24.jpg", weave: "kanjivaram", family: "Pink", view: "motif", label: "Motif", credit: "Thamizhpparithi Maari, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:A_saree.JPG" },
  { src: "/photos/commons/c25.jpg", weave: "paithani", family: "Blue", view: "pallu", label: "Pallu", credit: "Atudu, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Baluchori_Saree_DSC_0088.jpg" },
  { src: "/photos/commons/c26.jpg", weave: "paithani", family: "Red", view: "pallu", label: "Pallu", credit: "Atudu, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Baluchori_saree_DSC_0089.jpg" },
  { src: "/photos/commons/c27.jpg", weave: "paithani", family: "Orange", view: "pallu", label: "Pallu", credit: "Atudu, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Baluchori_saree_DSC_0093.jpg" },
  { src: "/photos/commons/c29.jpg", weave: "banarasi", family: "Purple", view: "motif", label: "Motif", credit: "Anilbhardwajnoida, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Benaras_brocade_sari.jpg" },
  { src: "/photos/commons/c30.jpg", weave: "linen-cotton", family: "Ivory", view: "border", label: "Border", credit: "Subornolota, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Border_of_Tangail_sari,from_the_1970s.jpg" },
  { src: "/photos/commons/c31.jpg", weave: "linen-cotton", family: "Pink", view: "folded", label: "Folded", credit: "Bikrampur, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Dhaka_Sari_Fabric_1.jpg" },
  { src: "/photos/commons/c32.jpg", weave: "chanderi", family: "Blue", view: "folded", label: "Folded", credit: "Bikrampur, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Dhaka_Sari_Fabric_2.jpg" },
  { src: "/photos/commons/c33.jpg", weave: "linen-cotton", family: "Red", view: "motif", label: "Motif", credit: "Atudu, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Dhanekhali_DSC_0511.JPG" },
  { src: "/photos/commons/c34.jpg", weave: "kanjivaram", family: "Blue", view: "folded", label: "Folded", credit: "రహ్మానుద్దీన్, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Kanchipuram_silk_sareer.JPG" },
  { src: "/photos/commons/c35.jpg", weave: "chanderi", family: "Orange", view: "motif", label: "Motif", credit: "User:आशीष भटनागर, Public domain, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Kota_sari_with_gota_patti_by_ashish_01.JPG" },
  { src: "/photos/commons/c37.jpg", weave: "patola", family: "Red", view: "motif", label: "Motif", credit: "Daderot, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari,_Orissa,_India,_view_2,_2000,_silk,_gold_thread_-_Textile_Museum_of_Canada_-_DSC00962.JPG" },
  { src: "/photos/commons/c38.jpg", weave: "chanderi", family: "Orange", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_India,_Honolulu_Museum_of_Art,_5835.1.JPG" },
  { src: "/photos/commons/c39.jpg", weave: "banarasi", family: "Pink", view: "motif", label: "Motif", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_India,_Honolulu_Museum_of_Art,_accession_5835.2.jpg" },
  { src: "/photos/commons/c42.jpg", weave: "paithani", family: "Green", view: "pallu", label: "Pallu", credit: "Atudu, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Swarnachari_Saree_DSC_0491.JPG" },
  { src: "/photos/commons/c45.jpg", weave: "kanjivaram", family: "Purple", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_1.jpg" },
  { src: "/photos/commons/c46.jpg", weave: "kanjivaram", family: "Blue", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_2.jpg" },
  { src: "/photos/commons/c47.jpg", weave: "kanjivaram", family: "Yellow", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_3.jpg" },
  { src: "/photos/commons/c48.jpg", weave: "kanjivaram", family: "Purple", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_4.jpg" },
  { src: "/photos/commons/c49.jpg", weave: "kanjivaram", family: "Pink", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_5.jpg" },
  { src: "/photos/commons/c50.jpg", weave: "kanjivaram", family: "Pink", view: "opened", label: "Opened out", credit: "En.saravanan, CC BY 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Koorai_silk_saree_6.jpg" },
  { src: "/photos/commons/c51.jpg", weave: "kanjivaram", family: "Red", view: "pallu", label: "Pallu", credit: "Kiranravikumar, CC BY-SA 3.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Mysore_Silk_Saree.jpg" },
  { src: "/photos/commons/c52.jpg", weave: "banarasi", family: "Ivory", view: "motif", label: "Motif", credit: "Unknown author, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Part_of_a_sari_made_of_silk_and_metal_thread.jpg" },
  { src: "/photos/commons/c54.jpg", weave: "patola", family: "Red", view: "opened", label: "Opened out", credit: "Daderot, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari,_Orissa,_India,_view_1,_2000,_silk,_gold_thread_-_Textile_Museum_of_Canada_-_DSC00960.JPG" },
  { src: "/photos/commons/c55.jpg", weave: "kanjivaram", family: "Purple", view: "border", label: "Border", credit: "Lasta2020, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_Border_in_red_and_gold.jpg" },
  { src: "/photos/commons/c56.jpg", weave: "kanjivaram", family: "Blue", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_India,_silk,_Honolulu_Museum_of_Art,_accession_14362.1.JPG" },
  { src: "/photos/commons/c57.jpg", weave: "kanjivaram", family: "Pink", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_Kanchipuram,_India,_Honolulu_Museum_of_Art,_accession_8736.1.JPG" },
  { src: "/photos/commons/c58.jpg", weave: "chanderi", family: "Ivory", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_Murshidabad,_India,_Honolulu_Museum_of_Art,_accession_8730.1.JPG" },
  { src: "/photos/commons/c59.jpg", weave: "banarasi", family: "Red", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_Murshidabad,_India,_Honolulu_Museum_of_Art_3933.1.JPG" },
  { src: "/photos/commons/c60.jpg", weave: "chanderi", family: "Ivory", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_Murshidabad,_India,_Honolulu_Museum_of_Art_5648.1.JPG" },
  { src: "/photos/commons/c61.jpg", weave: "banarasi", family: "Purple", view: "opened", label: "Opened out", credit: "Hiart, CC0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Sari_from_Murshidabad,_India,_Honolulu_Museum_of_Art_8729.1.JPG" },
  { src: "/photos/commons/c63.jpg", weave: "chanderi", family: "Ivory", view: "opened", label: "Opened out", credit: "आर्या जोशी, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Traditional_Assam_silk_saree.jpg" },
  { src: "/photos/commons/c64.jpg", weave: "patola", family: "Blue", view: "motif", label: "Motif", credit: "Ramkumar Kalyani, CC BY-SA 4.0, via Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Pochampalli_Ikat_saree.jpg" },
];
