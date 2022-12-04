import { useContext } from 'react';
import Layout from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../models';
import { AddCartItem } from '../store/Actions';
import { Store } from '../store/Store';
import data from '../utils/data';
export default function Home() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = (product: Product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? (existItem.quantity || 0) + 1 : 1;

    if (product.countInStock < quantity) {
      alert('Sorry, Product is out of stock.');
      return;
    }
    dispatch(new AddCartItem({ ...product, quantity }));
  };

  return (
    <Layout title="Home">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </section>
    </Layout>
  );
}
