import { Prisma, prisma } from '@repo/product-db';
import {Request, Response} from 'express'
import { producer } from '../utils/kafka.js';
import { StripeProductType } from '@repo/types';

export const createProduct = async (req: Request, res: Response) => {
   const data: Prisma.ProductCreateInput =  req.body;

   const {colors, images} = data;
   if(!colors || !Array.isArray(colors) || colors.length === 0){
    return res.status(400).json({message: 'Colors are required'});
   }

   if(!images || typeof images !== 'object'){
      return  res.status(400).json({message: 'Images are required'});
      }

      const missingColors = colors.filter((color) => !(color in images));

      if(missingColors.length > 0){
         return res.status(400).json({message: `Images are required for colors: ${missingColors.join(', ')}`});
      }

   const product = await prisma.product.create({data});

   const stripeProduct:StripeProductType = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
   }
   producer.send('product.created', {value: stripeProduct})
   res.status(201).json(product);
};
export const updateProduct = async (req: Request, res: Response) => {
   const {id} = req.params;
   const data: Prisma.ProductUpdateInput = req.body;

   const product = await prisma.product.update({
      where: {
         id: Number(id)
      },
      data
   });
   res.status(200).json(product);
};
export const deleteProduct = async (req: Request, res: Response) => {
   const {id} = req.params;

   await prisma.product.delete({
      where: {
         id: Number(id)
      }
   });

      producer.send('product.deleted', {value: Number(id)})


   res.status(200).json({message: 'Product deleted successfully'});
};

export const getProducts = async (req: Request, res: Response) => {
   const {sort, category, search, limit} = req.query;

   const orderBy = (()=> {
      switch (sort) {
         case "asc":
            return {price: Prisma.SortOrder.asc}
         case "desc":
            return {price: Prisma.SortOrder.desc}
         case "oldest":
            return {createdAt: Prisma.SortOrder.asc }
         default:
            return {createdAt: Prisma.SortOrder.desc}
      }
   })();

   const products = await prisma.product.findMany({
      where: {
         category: {
            slug: category as string,
         },
         name: {
            contains: search as string,
            mode: 'insensitive'
         }
      },
      orderBy,
      take: limit ? Number(limit): undefined
   });

   res.status(200).json(products);
};
export const getProduct = async (req: Request, res: Response) => {
   const {id} = req.params;

   const product = await prisma.product.findUnique({
      where: {
         id: Number(id)
      }
   })
   return res.status(200).json(product);
};
