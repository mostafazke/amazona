// import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Product } from '../models';
import { formatCurrency } from '../utils/formatCurrency';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  if (!product) {
    return <div>Loading</div>;
  }
  return (
    <article className="card hover:scale-105 transition-transform">
      <div className="card-header">
        <Link href={`/product/${product.slug}`}>
          <picture>
            <img
              className="rounded rounded-b-none"
              src={product.image}
              alt={product.name}
            />
          </picture>
        </Link>
      </div>
      <div className="card-body flex flex-col items-center justify-center p-3">
        <div className="w-full flex justify-between">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg font-bold">{product.name}</h2>
        </Link>

        <p>{formatCurrency(product.price)}</p>
        </div>
        <p className="mb-2">{product.description}</p>
      </div>
        <button className="primary-button w-full" type="button">
          <span>Add to cart</span>
        </button>
    </article>
  );
}
