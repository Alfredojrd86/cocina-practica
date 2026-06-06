// Consulta un producto por código de barras en Open Food Facts (API abierta, sin key).
const num = (v) => (typeof v === "number" && !Number.isNaN(v) ? v : null);

export async function fetchProduct(barcode) {
  try {
    const fields = "product_name,product_name_es,brands,ingredients_text,ingredients_text_es,nutriments,additives_tags,nova_group,nutriscore_grade,image_front_small_url";
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${fields}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    if (d.status !== 1 || !d.product) return null;
    const p = d.product;
    const n = p.nutriments || {};
    return {
      barcode,
      name: p.product_name_es || p.product_name || "Producto sin nombre",
      brand: p.brands || "",
      ingredients: (p.ingredients_text_es || p.ingredients_text || "").toLowerCase(),
      sugars: num(n.sugars_100g),
      carbs: num(n.carbohydrates_100g),
      proteins: num(n.proteins_100g),
      fat: num(n.fat_100g),
      additives: p.additives_tags || [],
      nova: p.nova_group || null,
      nutriscore: p.nutriscore_grade || null,
      image: p.image_front_small_url || null,
    };
  } catch {
    return null;
  }
}
