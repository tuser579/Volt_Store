import { mongoConnect } from "../../lib/mongoConnect";
import { NextResponse } from "next/server";

// GET /api/products?page=1&limit=8&search=&category=&sort=default
export async function GET(req) {
  let client;
  try {
    const { db, client: c } = await mongoConnect();
    client = c;

    const { searchParams } = new URL(req.url);

    const page     = Math.max(1, parseInt(searchParams.get("page")     || "1"));
    const limit    = Math.max(1, parseInt(searchParams.get("limit")    || "8"));
    const search   = searchParams.get("search")   || "";
    const category = searchParams.get("category") || "";
    const sort     = searchParams.get("sort")     || "default";

    // Build filter
    const filter = {};
    if (search) filter.$or = [
      { title:    { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
    if (category && category !== "All") filter.category = category;

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc")  sortOption = { price:  1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "rating")     sortOption = { rating: -1 };
    if (sort === "reviews")    sortOption = { reviews: -1 };

    const skip  = (page - 1) * limit;
    const total = await db.collection("products").countDocuments(filter);
    const pages = Math.ceil(total / limit);

    const products = await db.collection("products")
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    const data = products.map(p => ({ ...p, _id: p._id.toString() }));

    return NextResponse.json({ products: data, total, page, pages, limit });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

// DELETE /api/products?id=xxx
export async function DELETE(req) {
  let client;
  try {
    const { db, client: c } = await mongoConnect();
    client = c;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { ObjectId } = await import("mongodb");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

// POST /api/products — create new product
export async function POST(req) {
  let client;
  try {
    const { db, client: c } = await mongoConnect();
    client = c;

    const data = await req.json();

    if (!data.title || !data.shortDescription || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Title, shortDescription, description, price and category are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("products").insertOne({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Product created", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}