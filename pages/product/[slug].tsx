import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { Product } from '../../models';
import { AddCartItem } from '../../store/Actions';
import { Store } from '../../store/Store';
import data from '../../utils/data';
import { formatCurrency } from '../../utils/formatCurrency';

function ProductPage() {
  const { state, dispatch } = useContext(Store);
  const { query } = useRouter();
  const { slug } = query;
  const product: Product | undefined = data.products.find(
    (p) => p.slug === slug
  );
  if (!product) {
    return <div>Product not found.</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? (existItem.quantity || 0) + 1 : 1;

    if (product.countInStock < quantity) {
      alert('Sorry, Product is out of stock.')
      return;
    }
    dispatch(new AddCartItem({ ...product, quantity }));
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back to products</Link>
      </div>
      <section className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            priority={true}
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.category}</li>
            <li>
              {product.rating} of {product.numReviews} Reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <h4>Price</h4>
              <p>{formatCurrency(product.price)}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <h4>Status</h4>
              <p>{product.countInStock > 0 ? 'In stock' : 'Unavailavle'}</p>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}>
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default ProductPage;
