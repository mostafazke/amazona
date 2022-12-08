import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { IProduct, Product } from '../models';
import { AddCartItem } from '../store/Actions';
import { Store } from '../store/Store';
import db from '../utils/db';
export default function Home({ products }: { products: IProduct[] }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product: IProduct) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? (existItem.quantity || 0) + 1 : 1;
    const { data } = await axios.get<IProduct>(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry, Product is out of stock.');
      return;
    }
    dispatch(new AddCartItem({ ...product, quantity }));
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
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

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
};
