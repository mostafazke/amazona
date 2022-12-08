import axios from 'axios';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { IProduct, Product } from '../../models';
import { AddCartItem } from '../../store/Actions';
import { Store } from '../../store/Store';
import db from '../../utils/db';
import { formatCurrency } from '../../utils/formatCurrency';

function ProductPage({ product }: { product: IProduct }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  if (!product) {
    return (
      <Layout title="Not found">
        <div className="text-center mt-5">
          <h1 className="text-xl font-bold">Product not found.</h1>
        </div>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params as ParsedUrlQuery;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
};

export default ProductPage;
