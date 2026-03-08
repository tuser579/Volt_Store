import { mongoConnect } from "@/app/lib/mongoConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET /api/products/:id
export async function GET(req, { params }) {
  let client;
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { db, client: c } = await mongoConnect();
    client = c;

    const product = await db.collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: { ...product, _id: product._id.toString() } });
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

// PUT /api/products/:id — update product
export async function PUT(req, { params }) {
  let client;
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { db, client: c } = await mongoConnect();
    client = c;

    const data = await req.json();
    delete data._id; // never update _id

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}