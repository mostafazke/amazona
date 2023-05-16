import axios from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { IProduct, Product } from '../models';
import { AddCartItem } from '../store/Actions';
import { Store } from '../store/Store';
import db from '../utils/db';

type Props = {
  products: IProduct[];
  featuredProducts: IProduct[];
};

export default function Home({ products, featuredProducts }: Props) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product: IProduct) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? (existItem.quantity || 0) + 1 : 1;
    const { data } = await axios.get<IProduct>(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch(new AddCartItem({ ...product, quantity }));
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home">
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link className="flex" href={`/product/${product.slug}`}>
              {product.banner && (
                <picture>
                  <source srcSet={product.banner} type="image/jpg" />
                  <img src={product.banner} alt={product.name} />
                </picture>
              )}
            </Link>
          </div>
        ))}
      </Carousel>
      <h2 className="h2 my-4">Latest Products</h2>
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
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
};
