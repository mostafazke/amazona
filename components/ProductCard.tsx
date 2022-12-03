// import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Product } from '../models';
import { AddCartItem } from '../store/Actions';
import { Store } from '../store/Store';
import { formatCurrency } from '../utils/formatCurrency';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { state, dispatch } = useContext(Store);

  if (!product) {
    return <div>Loading</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? (existItem.quantity || 0) + 1 : 1;

    if (product.countInStock < quantity) {
      alert('Sorry, Product is out of stock.');
      return;
    }
    dispatch(new AddCartItem({ ...product, quantity }));
  };

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
      <button
        className="primary-button w-full"
        type="button"
        onClick={addToCartHandler}>
        <span>Add to cart</span>
      </button>
    </article>
  );
}
