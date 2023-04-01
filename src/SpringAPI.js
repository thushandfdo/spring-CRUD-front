import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function SpringAPI() {
    const [products, setProducts] = useState([]);
    const [updateId, setUpdateId] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [msg, setMsg] = useState('');

    const handleClear = () => {
        setName('');
        setPrice(0);
        setQuantity(0);
        setUpdateId(0);
    };

    const getProducts = async () => {
        await axios.get('http://localhost:9191/product/get')
            .then(response => {
                if (response.status === 200) {
                    setProducts(response.data);
                }
                else {
                    console.log("Error: " + response);
                }
            })
    };

    const saveProduct = async () => {
        const product = { name, price, quantity };

        await axios.post('http://localhost:9191/product/post', product)
            .then(response => {
                if (response.status === 200) {
                    setMsg("Product saved successfully");
                    setProducts([...products, response.data]);
                }
                else {
                    console.log("Error: " + response);
                }
            })

        handleClear();
    };

    const setToUpdate = (product) => {
        console.log(product);
        setUpdateId(product.id);
        setName(product.name);
        setPrice(product.price);
        setQuantity(product.quantity);
    };

    const updateProduct = async () => {
        const product = { id: updateId, name, price, quantity };

        await axios.put('http://localhost:9191/product/update/' + updateId, product)
            .then(response => {
                if (response.status === 200) {
                    setMsg("Product updated successfully");
                    let newProducts = products.filter((product) => product.id !== updateId);
                    setProducts([...newProducts, response.data]);
                }
                else {
                    console.log("Error: " + response);
                }
            })

        handleClear();
    };

    const deleteProduct = async (id) => {
        await axios.delete('http://localhost:9191/product/delete/' + id)
            .then(response => {
                if (response.status === 200) {
                    setMsg("Product deleted successfully");
                    let newProducts = products.filter((product) => product.id !== id);
                    setProducts([...newProducts]);
                }
                else {
                    console.log("Error: " + response);
                }
            })
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className='spring-api'>
            <div className='form-container'>
                <fieldset className='product-form'>
                    <h2 style={{ textAlign: 'center' }}>Product Details</h2>

                    <div className='input-field'>
                        <label htmlFor="name">Name :</label>
                        <input type="text" name="name" id="name" value={name}
                            onChange={((e) => setName(e.target.value))} />
                    </div>

                    <div className='input-field'>
                        <label htmlFor="price">Price :</label>
                        <input type="number" name="price" id="price" value={price}
                            onChange={((e) => setPrice(e.target.value))} />
                    </div>

                    <div className='input-field'>
                        <label htmlFor="quantity">Quantity :</label>
                        <input type="number" name="quantity" id="quantity" value={quantity}
                            onChange={((e) => setQuantity(e.target.value))} />
                    </div>
                    <div className="buttons">
                        <button onClick={saveProduct} style={{ marginRight: '20px' }}>Save</button>
                        <button onClick={updateProduct}>Update</button>
                    </div>
                </fieldset>

                <table border={1} width={'40%'} className="product-list">
                    <caption style={{ marginBottom: '10px' }}>Product List</caption>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 && products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td className='edit-update'>
                                        <button onClick={() => setToUpdate(product)}>Edit</button>
                                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <h3 style={{ textAlign: 'center', color: 'gray' }}>{msg}</h3>
            </div>
        </div>
    )
}
