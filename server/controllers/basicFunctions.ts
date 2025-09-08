import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/prisma";

const productSchema = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number(),
});

export const additem = async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body.prod);
  if (!parsed.success)
    return res.json({
      msg: "Invalid Format",
    });

  const data = parsed.data;
  try {
    const resp = await prisma.product.create({
      data: parsed.data,
    });
    return res.status(201).json({ msg: "Product created", product: resp });
  } catch (error) {
    return res.status(500).json({ msg: "Database error", error });
  }
};


export const getitems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.product.findMany();
    return res.json({ products: items });
  } catch (error) {
    return res.status(500).json({ msg: "Database error", error });
  }
}

export const deleteitem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ msg: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Database error", error });
  }
};

export const updateitem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ msg: "Invalid format"});
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return res.json({ msg: "Product updated", product: updated });
  } catch (error) {
    return res.status(500).json({ msg: "Database error", error });
  }
};
