export const products = [
    { id: 1, name: 'Product 1', price: 100, description: 'Description for product 1' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description for product 2' },
    { id: 3, name: 'Product 3', price: 300, description: 'Description for product 3' },
  ];
  
  export const getProducts = () => products;
  
  export const getProductById = (id) => products.find((product) => product.id === parseInt(id));
  