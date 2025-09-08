import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";
import { AuthRequest } from "../middleware/authmiddleware"; 

// --- ADD TO CART ---
export const addtocart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // No need for `as any`
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
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
export const getcartitems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    console.log(cart.items)
    return res.status(200).json({ items: cart.items });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// --- REMOVE ITEM FROM CART ---
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { id } = req.params; // cart item ID to remove
    if (!id) {
      return res.status(400).json({ message: "Cart item ID is required" });
    }

    // Check if the item exists in user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, cart: { userId } }, // ensures user owns the cart
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
