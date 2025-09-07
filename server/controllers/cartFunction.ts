import { Request, Response } from "express";
import {prisma} from "../prisma/prisma"

// --- ADD TO CART ---
export const addtocart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // from authmiddleware
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    // Ensure user has a cart (create one if not)
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if product already exists in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// --- GET CART ITEMS ---
export const getcartitems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, // fetch full product details
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [] }); // empty cart
    }

    return res.status(200).json({ items: cart.items });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
