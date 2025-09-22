"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import the separate CSS file
import './EditShop.css';

// Mock database to simulate fetching and updating data.
type ShopData = {
    shop_id: string;
    user_id: string;
    shop_name: string;
    address: string;
    phone_number: string;
    contact_person: string;
    previous_day_stock: number;
    previous_day_sales: number;
    username: string;
    email: string;
};

const MOCK_DB: { [key: string]: ShopData } = {
    '1': {
        shop_id: '1',
        user_id: 'user123',
        shop_name: 'Green Grocer',
        address: '123 Mushroom Lane, Fungi City',
        phone_number: '123-456-7890',
        contact_person: 'Jane Doe',
        previous_day_stock: 1500,
        previous_day_sales: 800,
        username: 'janedoe',
        email: 'jane@example.com',
    },
};

// Simulates fetching shop data from a backend API.
const fetchShopData = (id: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = MOCK_DB[id];
            if (data) {
                resolve(data);
            } else {
                reject(new Error('Shop not found.'));
            }
        }, 500); // Simulate network delay
    });
};

// Simulates updating shop data on a backend.
const updateShopData = (id: string, formData: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (formData.username === 'existinguser' || formData.email === 'existing@example.com') {
                return reject(new Error('username_or_email_exists'));
            }
            MOCK_DB[id] = { ...MOCK_DB[id], ...formData };
            resolve({ success: true });
        }, 500); // Simulate network delay
    });
};

export default function EditShop() {
    const router = useRouter();
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const [formData, setFormData] = useState({
        shopName: '',
        contactPerson: '',
        address: '',
        phoneNumber: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const shopId = '1';

    useEffect(() => {
        const loadData = async () => {
            if (!shopId) {
                setErrorMessage('No shop ID specified for editing.');
                setIsLoading(false);
                return;
            }
            try {
                const data = await fetchShopData(shopId);
                setShopData(data as ShopData);
                setFormData({
                    shopName: (data as ShopData).shop_name,
                    contactPerson: (data as ShopData).contact_person,
                    address: (data as ShopData).address,
                    phoneNumber: (data as ShopData).phone_number,
                    username: (data as ShopData).username,
                    email: (data as ShopData).email,
                    password: '',
                    confirmPassword: '',
                });
            } catch (error: any) {
                setErrorMessage(error.message || 'Failed to load shop data.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [shopId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('New passwords do not match.');
            return;
        }
        try {
            await updateShopData(shopId, {
                shop_name: formData.shopName,
                contact_person: formData.contactPerson,
                address: formData.address,
                phone_number: formData.phoneNumber,
                username: formData.username,
                email: formData.email,
                password: formData.password || undefined,
            });
            setSuccessMessage('Shop details updated successfully!');
        } catch (error: any) {
            if (error.message === 'username_or_email_exists') {
                setErrorMessage('The username or email address is already registered to another user. Please use a different one.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const navItems = [
        { href: '/admin/admin-dashboard', label: 'Dashboard', active: false },
        { href: '/admin/manage-shops', label: 'Manage Shops', active: true },
        { href: '/admin/ManageDeliveryPerson', label: 'Manage Delivery People', active: false },
        { href: '/admin/ViewAllORders', label: 'View All Orders', active: false },
        { href: '/admin/Reports', label: 'Reports', active: false },
        { href: '/admin/Settings', label: 'Settings', active: false },
    ];
    
    const handleLogout = () => {
        console.log('Logging out...');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="edit-shop-container">
                <aside className="sidebar">
                    <div className="sidebar-title">Admin Panel</div>
                    <nav>
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <div className="main-content-area loading-state">
                    <div className="loading-text">Loading...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="edit-shop-container">
            <aside className="sidebar">
                <div className="sidebar-title">Admin Panel</div>
                <nav>
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className="main-content-area">
                <header className="page-header">
                    <h1 className="page-title">Edit Shop: {shopData?.shop_name ?? 'N/A'}</h1>
                    <Link href="/admin/manage-shops" className="back-button">
                        Back to Manage Shops
                    </Link>
                </header>

                {errorMessage && (
                    <div className="error-message" role="alert">
                        <strong className="error-title">Error!</strong>
                        <span className="error-text">{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="success-message" role="alert">
                        <strong className="success-title">Success!</strong>
                        <span className="success-text">{successMessage}</span>
                    </div>
                )}

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="form-content">
                        <input type="hidden" name="shop_id" value={shopData?.shop_id ?? ''} />
                        <input type="hidden" name="user_id" value={shopData?.user_id ?? ''} />
                        <h2 className="form-section-title">Shop Details</h2>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="shopName" className="form-label">Shop Name:</label>
                                <input
                                    type="text"
                                    id="shopName"
                                    name="shopName"
                                    required
                                    className="form-input"
                                    value={formData.shopName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="contactPerson" className="form-label">Contact Person:</label>
                                <input
                                    type="text"
                                    id="contactPerson"
                                    name="contactPerson"
                                    required
                                    className="form-input"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="address" className="form-label">Address:</label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                required
                                className="form-input"
                                value={formData.address}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="form-field">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                required
                                className="form-input"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <h2 className="form-section-title-alt">Login Credentials</h2>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    className="form-input"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="email" className="form-label">Email Address:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <h2 className="form-section-title-alt">Change Password (Optional)</h2>
                        <p className="form-description">Leave password fields blank if you don't want to change the password.</p>
                        <div className="form-field">
                            <label htmlFor="password" className="form-label">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter new password (optional)"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-field">
                            <button type="submit" className="submit-button">
                                Update Shop
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}