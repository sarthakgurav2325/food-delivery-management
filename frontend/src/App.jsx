
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Utensils,
  Users,
  ShoppingBag,
  Bike,
  MapPin,
  Menu,
  Bell,
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock,
  RefreshCw,
  X,
  CheckCircle
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api";

const STATUSES = [
  "Pending", "Confirmed", "Preparing", "Picked Up",
  "Out for Delivery", "Delivered", "Cancelled"
];

const emptyFood = {
  name: "", description: "", price: "", category: "",
  imageUrl: "", available: true
};

const emptyCustomer = {
  fullName: "", email: "", phone: "", address: ""
};

const emptyPartner = {
  fullName: "", phone: "", vehicleType: "",
  vehicleNumber: "", available: true
};

const emptyOrder = {
  customerId: "", deliveryPartnerId: "",
  totalAmount: "", deliveryAddress: "", orderStatus: "Pending"
};

const emptyTracking = {
  currentLocation: "", latitude: "", longitude: "",
  deliveryStatus: ""
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [foods, setFoods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const [foodSearch, setFoodSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [foodForm, setFoodForm] = useState(emptyFood);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [partnerForm, setPartnerForm] = useState(emptyPartner);
  const [orderForm, setOrderForm] = useState(emptyOrder);

  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState("");
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [trackingForm, setTrackingForm] = useState(emptyTracking);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const [globalSearch, setGlobalSearch] = useState("");

  const loadFoods = async () => {
    const res = await axios.get(`${API}/foods`);
    setFoods(res.data);
  };

  const loadCustomers = async () => {
    const res = await axios.get(`${API}/customers`);
    setCustomers(res.data);
  };

  const loadPartners = async () => {
    const res = await axios.get(`${API}/delivery-partners`);
    setDeliveryPartners(res.data);
  };

  const loadOrders = async () => {
    const res = await axios.get(`${API}/orders`);
    setOrders(res.data);
  };

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadFoods(), loadCustomers(), loadPartners(), loadOrders()
      ]);
    } catch (error) {
      console.error("Unable to load application data:", error);
      alert("Unable to load data. Check that your Spring Boot backend is running.");
    }
  };

 useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const [foodRes, customerRes, partnerRes, orderRes] =
        await Promise.all([
          axios.get(`${API}/foods`, { signal: controller.signal }),
          axios.get(`${API}/customers`, { signal: controller.signal }),
          axios.get(`${API}/delivery-partners`, { signal: controller.signal }),
          axios.get(`${API}/orders`, { signal: controller.signal })
        ]);

      setFoods(foodRes.data);
      setCustomers(customerRes.data);
      setDeliveryPartners(partnerRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        console.error("Dashboard loading failed:", error);
      }
    }
  };

  fetchData();

  return () => controller.abort();
}, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Food Management", icon: Utensils },
    { name: "Customers", icon: Users },
    { name: "Orders", icon: ShoppingBag },
    { name: "Delivery Partners", icon: Bike },
    { name: "Order Tracking", icon: MapPin }
  ];

  // FOOD MANAGEMENT
  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...foodForm, price: Number(foodForm.price) };
      if (editingFoodId) {
        await axios.put(`${API}/foods/${editingFoodId}`, data);
      } else {
        await axios.post(`${API}/foods`, data);
      }
      await loadFoods();
      setShowFoodForm(false);
      setEditingFoodId(null);
      setFoodForm(emptyFood);
    } catch (error) {
      console.error(error);
      alert("Unable to save food.");
    }
  };

  const editFood = (food) => {
    setFoodForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      category: food.category || "",
      imageUrl: food.imageUrl || "",
      available: food.available ?? true
    });
    setEditingFoodId(food.id);
    setShowFoodForm(true);
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await axios.delete(`${API}/foods/${id}`);
      await loadFoods();
    } catch {
      alert("Unable to delete food.");
    }
  };

  // CUSTOMER MANAGEMENT
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomerId) {
        await axios.put(`${API}/customers/${editingCustomerId}`, customerForm);
      } else {
        await axios.post(`${API}/customers`, customerForm);
      }
      await loadCustomers();
      setShowCustomerForm(false);
      setEditingCustomerId(null);
      setCustomerForm(emptyCustomer);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save customer.");
    }
  };

  const editCustomer = (customer) => {
    setCustomerForm({
      fullName: customer.fullName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || ""
    });
    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await axios.delete(`${API}/customers/${id}`);
      await loadCustomers();
    } catch {
      alert("Unable to delete customer. It may be linked to an order.");
    }
  };

  // DELIVERY PARTNER MANAGEMENT
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPartnerId) {
        await axios.put(`${API}/delivery-partners/${editingPartnerId}`, partnerForm);
      } else {
        await axios.post(`${API}/delivery-partners`, partnerForm);
      }
      await loadPartners();
      await loadOrders();
      setShowPartnerForm(false);
      setEditingPartnerId(null);
      setPartnerForm(emptyPartner);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save delivery partner.");
    }
  };

  const editPartner = (partner) => {
    setPartnerForm({
      fullName: partner.fullName || "",
      phone: partner.phone || "",
      vehicleType: partner.vehicleType || "",
      vehicleNumber: partner.vehicleNumber || "",
      available: partner.available ?? true
    });
    setEditingPartnerId(partner.id);
    setShowPartnerForm(true);
  };

  const deletePartner = async (id) => {
    if (!window.confirm("Delete this delivery partner?")) return;
    try {
      await axios.delete(`${API}/delivery-partners/${id}`);
      await loadPartners();
    } catch {
      alert("Unable to delete this partner. They may be assigned to an order.");
    }
  };

  // ORDER MANAGEMENT
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      const customer = customers.find(
        (item) => item.id === Number(orderForm.customerId)
      );

      const partner = deliveryPartners.find(
        (item) => item.id === Number(orderForm.deliveryPartnerId)
      );

      if (!customer) {
        alert("Please select a customer.");
        return;
      }

      if (orderForm.deliveryPartnerId && !partner) {
        alert("Please select a valid delivery partner.");
        return;
      }

      const data = {
        customer: { id: customer.id },
        deliveryPartner: partner ? { id: partner.id } : null,
        totalAmount: Number(orderForm.totalAmount),
        deliveryAddress: orderForm.deliveryAddress,
        orderStatus: orderForm.orderStatus
      };

      if (editingOrderId) {
        await axios.put(`${API}/orders/${editingOrderId}`, data);
      } else {
        await axios.post(`${API}/orders`, data);
      }

      await Promise.all([loadOrders(), loadPartners()]);
      setShowOrderForm(false);
      setEditingOrderId(null);
      setOrderForm(emptyOrder);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save order.");
    }
  };

  const editOrder = (order) => {
    setOrderForm({
      customerId: order.customer?.id || "",
      deliveryPartnerId: order.deliveryPartner?.id || "",
      totalAmount: order.totalAmount ?? "",
      deliveryAddress: order.deliveryAddress || "",
      orderStatus: order.orderStatus || "Pending"
    });
    setEditingOrderId(order.id);
    setShowOrderForm(true);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/orders/${id}/status`, { status });
      await loadOrders();
      await loadPartners();
    } catch (error) {
      console.error(error);
      alert("Unable to update order status.");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    await updateOrderStatus(id, "Cancelled");
  };

  const availablePartners = deliveryPartners.filter(
    (partner) => partner.available
  );

  // ORDER TRACKING
  const loadTracking = async (orderId) => {
    if (!orderId) {
      setTrackingHistory([]);
      return;
    }

    setLoadingTracking(true);
    try {
      const res = await axios.get(`${API}/tracking/${orderId}`);
      setTrackingHistory(res.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load tracking history.");
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrackingOrder) {
      alert("Select an order first.");
      return;
    }

    try {
      const data = {
        currentLocation: trackingForm.currentLocation,
        latitude: trackingForm.latitude === "" ? null : Number(trackingForm.latitude),
        longitude: trackingForm.longitude === "" ? null : Number(trackingForm.longitude),
        deliveryStatus: trackingForm.deliveryStatus || undefined
      };

      await axios.post(
        `${API}/tracking/${selectedTrackingOrder}`,
        data
      );

      await loadTracking(selectedTrackingOrder);
      setTrackingForm(emptyTracking);
      alert("Tracking update added successfully.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to add tracking update.");
    }
  };

  const estimateDelivery = (status) => {
    const estimates = {
      Pending: "Not estimated yet",
      Confirmed: "About 45–60 minutes",
      Preparing: "About 30–45 minutes",
      "Picked Up": "About 20–30 minutes",
      "Out for Delivery": "About 10–20 minutes",
      Delivered: "Delivered",
      Cancelled: "Cancelled"
    };
    return estimates[status] || "To be confirmed";
  };

  const statusClass = (status) =>
    `status-badge status-${(status || "pending").toLowerCase().replaceAll(" ", "-")}`;

  const filteredFoods = foods.filter((item) =>
    `${item.name} ${item.category || ""}`.toLowerCase()
      .includes(foodSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((item) =>
    `${item.fullName} ${item.email} ${item.phone}`.toLowerCase()
      .includes(customerSearch.toLowerCase())
  );

  const filteredPartners = deliveryPartners.filter((item) =>
    `${item.fullName} ${item.phone} ${item.vehicleNumber}`.toLowerCase()
      .includes(partnerSearch.toLowerCase())
  );

  const activeOrders = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.orderStatus)
  ).length;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Utensils size={25} /></div>
          <div>
            <h2>FoodExpress</h2>
            <span>Management System</span>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`menu-item ${activePage === item.name ? "active" : ""}`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">A</div>
          <div><strong>Administrator</strong><span>System Admin</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setActivePage("Dashboard")}>
              <Menu size={22} />
            </button>
            <div>
              <h3>{activePage}</h3>
              <p>Welcome to FoodExpress Management</p>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Search orders..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
            <button className="notification-button" title="Notifications">
              <Bell size={21} />
            </button>
            <div className="profile-avatar">A</div>
          </div>
        </header>

        <section className="page-content">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <div className="welcome-section">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p>Monitor your food delivery business at a glance.</p>
                </div>
                <button className="primary-button" onClick={loadAllData}>
                  <RefreshCw size={17} /> Refresh Data
                </button>
              </div>

              <div className="stats-grid">
                {[
                  { title: "Total Foods", value: foods.length, icon: Utensils, color: "orange" },
                  { title: "Total Customers", value: customers.length, icon: Users, color: "blue" },
                  { title: "Total Orders", value: orders.length, icon: ShoppingBag, color: "green" },
                  { title: "Available Partners", value: availablePartners.length, icon: Bike, color: "purple" }
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div className="stat-card" key={stat.title}>
                      <div className={`stat-icon ${stat.color}`}><Icon size={24} /></div>
                      <div><p>{stat.title}</p><h2>{stat.value}</h2></div>
                    </div>
                  );
                })}
              </div>

              <div className="stats-grid secondary-stats">
                <div className="stat-card">
                  <div className="stat-icon orange"><Clock size={24} /></div>
                  <div><p>Active Orders</p><h2>{activeOrders}</h2></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><CheckCircle size={24} /></div>
                  <div><p>Delivered Orders</p><h2>{orders.filter(o => o.orderStatus === "Delivered").length}</h2></div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-heading">
                  <div><h3>Welcome to FoodExpress</h3><p>Your food delivery management workspace.</p></div>
                </div>
                <div className="quick-actions">
                  {menuItems.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.name} className="quick-action" onClick={() => setActivePage(item.name)}>
                        <Icon size={23} /><span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-heading"><div><h3>Recent Orders</h3><p>Latest customer orders</p></div></div>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer?.fullName || "N/A"}</td>
                          <td>₹{order.totalAmount}</td>
                          <td><span className={statusClass(order.orderStatus)}>{order.orderStatus}</span></td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan="4" className="text-center">No orders yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* FOOD MANAGEMENT */}
          {activePage === "Food Management" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div><h3>Food Management</h3><p>Manage your restaurant food items.</p></div>
                <button className="primary-button" onClick={() => {
                  setFoodForm(emptyFood); setEditingFoodId(null); setShowFoodForm(true);
                }}><Plus size={17} /> Add Food</button>
              </div>

              <input className="form-control mb-3" placeholder="Search food by name or category..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} />

              {showFoodForm && (
                <form className="form-panel" onSubmit={handleFoodSubmit}>
                  <h5>{editingFoodId ? "Edit Food" : "Add New Food"}</h5>
                  <input className="form-control" placeholder="Food Name" value={foodForm.name} onChange={e => setFoodForm({...foodForm, name:e.target.value})} required />
                  <textarea className="form-control" placeholder="Description" value={foodForm.description} onChange={e => setFoodForm({...foodForm, description:e.target.value})} />
                  <input className="form-control" type="number" min="0.01" step="0.01" placeholder="Price" value={foodForm.price} onChange={e => setFoodForm({...foodForm, price:e.target.value})} required />
                  <input className="form-control" placeholder="Category" value={foodForm.category} onChange={e => setFoodForm({...foodForm, category:e.target.value})} />
                  <input className="form-control" placeholder="Image URL" value={foodForm.imageUrl} onChange={e => setFoodForm({...foodForm, imageUrl:e.target.value})} />
                  <label className="checkbox-line"><input type="checkbox" checked={foodForm.available} onChange={e => setFoodForm({...foodForm, available:e.target.checked})} /> Available</label>
                  <FormActions editing={editingFoodId} noun="Food" onCancel={() => setShowFoodForm(false)} />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>ID</th><th>Food Name</th><th>Category</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredFoods.map(food => (
                      <tr key={food.id}>
                        <td>{food.id}</td><td>{food.name}</td><td>{food.category}</td><td>₹{food.price}</td>
                        <td>{food.available ? "Available" : "Unavailable"}</td>
                        <td><ActionButtons onEdit={() => editFood(food)} onDelete={() => deleteFood(food.id)} /></td>
                      </tr>
                    ))}
                    {filteredFoods.length === 0 && <EmptyRow cols={6} text="No food items found." />}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}
          {activePage === "Customers" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div><h3>Customer Management</h3><p>Manage your registered customers.</p></div>
                <button className="primary-button" onClick={() => {
                  setCustomerForm(emptyCustomer); setEditingCustomerId(null); setShowCustomerForm(true);
                }}><Plus size={17} /> Add Customer</button>
              </div>
              <input className="form-control mb-3" placeholder="Search by name, email or phone..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} />

              {showCustomerForm && (
                <form className="form-panel" onSubmit={handleCustomerSubmit}>
                  <h5>{editingCustomerId ? "Edit Customer" : "Add New Customer"}</h5>
                  <input className="form-control" placeholder="Full Name" value={customerForm.fullName} onChange={e => setCustomerForm({...customerForm, fullName:e.target.value})} required />
                  <input className="form-control" type="email" placeholder="Email Address" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email:e.target.value})} required />
                  <input className="form-control" placeholder="Phone Number" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone:e.target.value})} />
                  <textarea className="form-control" placeholder="Address" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address:e.target.value})} />
                  <FormActions editing={editingCustomerId} noun="Customer" onCancel={() => setShowCustomerForm(false)} />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td><td>{customer.fullName}</td><td>{customer.email}</td><td>{customer.phone}</td><td>{customer.address}</td>
                        <td><ActionButtons onEdit={() => editCustomer(customer)} onDelete={() => deleteCustomer(customer.id)} /></td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && <EmptyRow cols={6} text="No customers found." />}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activePage === "Orders" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div><h3>Order Management</h3><p>Create orders, assign partners and manage order progress.</p></div>
                <button className="primary-button" onClick={() => {
                  setOrderForm(emptyOrder); setEditingOrderId(null); setShowOrderForm(true);
                }}><Plus size={17} /> Create Order</button>
              </div>

              {showOrderForm && (
                <form className="form-panel" onSubmit={handleOrderSubmit}>
                  <h5>{editingOrderId ? "Edit Order" : "Create New Order"}</h5>

                  <label>Customer</label>
                  <select className="form-control" value={orderForm.customerId} onChange={e => {
                    const customer = customers.find(c => c.id === Number(e.target.value));
                    setOrderForm({...orderForm, customerId:e.target.value, deliveryAddress: customer?.address || orderForm.deliveryAddress});
                  }} required>
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.fullName} — {c.phone}</option>)}
                  </select>

                  <label>Delivery Partner</label>
                  <select className="form-control" value={orderForm.deliveryPartnerId} onChange={e => setOrderForm({...orderForm, deliveryPartnerId:e.target.value})}>
                    <option value="">Not assigned</option>
                    {deliveryPartners.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.available ? "Available" : "Unavailable"})
                      </option>
                    ))}
                  </select>

                  <input className="form-control" type="number" min="0.01" step="0.01" placeholder="Total Amount (₹)" value={orderForm.totalAmount} onChange={e => setOrderForm({...orderForm, totalAmount:e.target.value})} required />
                  <textarea className="form-control" placeholder="Delivery Address" value={orderForm.deliveryAddress} onChange={e => setOrderForm({...orderForm, deliveryAddress:e.target.value})} required />

                  <label>Order Status</label>
                  <select className="form-control" value={orderForm.orderStatus} onChange={e => setOrderForm({...orderForm, orderStatus:e.target.value})}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <FormActions editing={editingOrderId} noun="Order" onCancel={() => setShowOrderForm(false)} />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Delivery Partner</th><th>Status</th><th>Estimated Time</th><th>Actions</th></tr></thead>
                  <tbody>
                    {orders.filter(o => `${o.id} ${o.customer?.fullName || ""} ${o.orderStatus || ""}`.toLowerCase().includes(globalSearch.toLowerCase())).map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer?.fullName || "N/A"}<small className="cell-subtitle">{order.deliveryAddress}</small></td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          {order.deliveryPartner?.fullName || "Not assigned"}
                          {order.deliveryPartner && <small className="cell-subtitle">{order.deliveryPartner.vehicleNumber}</small>}
                        </td>
                        <td>
                          <select className="status-select" value={order.orderStatus} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>{estimateDelivery(order.orderStatus)}</td>
                        <td>
                          <div className="action-group">
                            <button className="icon-button edit" title="Edit" onClick={() => editOrder(order)}><Pencil size={16}/></button>
                            {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                              <button className="icon-button delete" title="Cancel order" onClick={() => cancelOrder(order.id)}><X size={16}/></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && <EmptyRow cols={7} text="No orders found." />}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DELIVERY PARTNERS */}
          {activePage === "Delivery Partners" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div><h3>Delivery Partner Management</h3><p>Manage your delivery team and availability.</p></div>
                <button className="primary-button" onClick={() => {
                  setPartnerForm(emptyPartner); setEditingPartnerId(null); setShowPartnerForm(true);
                }}><Plus size={17} /> Add Partner</button>
              </div>
              <input className="form-control mb-3" placeholder="Search by name, phone or vehicle..." value={partnerSearch} onChange={e => setPartnerSearch(e.target.value)} />

              {showPartnerForm && (
                <form className="form-panel" onSubmit={handlePartnerSubmit}>
                  <h5>{editingPartnerId ? "Edit Delivery Partner" : "Add Delivery Partner"}</h5>
                  <input className="form-control" placeholder="Full Name" value={partnerForm.fullName} onChange={e => setPartnerForm({...partnerForm, fullName:e.target.value})} required />
                  <input className="form-control" placeholder="Phone Number" value={partnerForm.phone} onChange={e => setPartnerForm({...partnerForm, phone:e.target.value})} required />
                  <select className="form-control" value={partnerForm.vehicleType} onChange={e => setPartnerForm({...partnerForm, vehicleType:e.target.value})} required>
                    <option value="">Select Vehicle Type</option>
                    {["Bike", "Scooter", "Car", "Bicycle"].map(v => <option key={v}>{v}</option>)}
                  </select>
                  <input className="form-control" placeholder="Vehicle Number" value={partnerForm.vehicleNumber} onChange={e => setPartnerForm({...partnerForm, vehicleNumber:e.target.value})} required />
                  <label>Availability</label>
                  <select className="form-control" value={String(partnerForm.available)} onChange={e => setPartnerForm({...partnerForm, available:e.target.value === "true"})}>
                    <option value="true">Available</option><option value="false">Unavailable</option>
                  </select>
                  <FormActions editing={editingPartnerId} noun="Partner" onCancel={() => setShowPartnerForm(false)} />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Vehicle</th><th>Vehicle Number</th><th>Availability</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredPartners.map(partner => (
                      <tr key={partner.id}>
                        <td>{partner.id}</td><td>{partner.fullName}</td><td>{partner.phone}</td><td>{partner.vehicleType}</td><td>{partner.vehicleNumber}</td>
                        <td><span className={`status-badge ${partner.available ? "status-delivered" : "status-cancelled"}`}>{partner.available ? "Available" : "Unavailable"}</span></td>
                        <td><ActionButtons onEdit={() => editPartner(partner)} onDelete={() => deletePartner(partner.id)} /></td>
                      </tr>
                    ))}
                    {filteredPartners.length === 0 && <EmptyRow cols={7} text="No delivery partners found." />}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDER TRACKING */}
          {activePage === "Order Tracking" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div><h3>Order Tracking</h3><p>View delivery progress and add location updates.</p></div>
              </div>

              <div className="tracking-selector">
                <label>Select Order</label>
                <select className="form-control" value={selectedTrackingOrder} onChange={e => {
                  setSelectedTrackingOrder(e.target.value);
                  loadTracking(e.target.value);
                }}>
                  <option value="">Choose an order to track</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} — {order.customer?.fullName || "Customer"} ({order.orderStatus})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTrackingOrder && (
                <>
                  {(() => {
                    const order = orders.find(o => o.id === Number(selectedTrackingOrder));
                    if (!order) return null;
                    return (
                      <div className="tracking-summary">
                        <div><span>Customer</span><strong>{order.customer?.fullName || "N/A"}</strong></div>
                        <div><span>Delivery Partner</span><strong>{order.deliveryPartner?.fullName || "Not assigned"}</strong></div>
                        <div><span>Order Status</span><strong className={statusClass(order.orderStatus)}>{order.orderStatus}</strong></div>
                        <div><span>Estimated Time</span><strong>{estimateDelivery(order.orderStatus)}</strong></div>
                      </div>
                    );
                  })()}

                  <form className="form-panel" onSubmit={handleTrackingSubmit}>
                    <h5><MapPin size={18}/> Add Tracking Update</h5>
                    <input className="form-control" placeholder="Current Location" value={trackingForm.currentLocation} onChange={e => setTrackingForm({...trackingForm, currentLocation:e.target.value})} required />
                    <input className="form-control" type="number" step="any" placeholder="Latitude (optional)" value={trackingForm.latitude} onChange={e => setTrackingForm({...trackingForm, latitude:e.target.value})} />
                    <input className="form-control" type="number" step="any" placeholder="Longitude (optional)" value={trackingForm.longitude} onChange={e => setTrackingForm({...trackingForm, longitude:e.target.value})} />
                    <select className="form-control" value={trackingForm.deliveryStatus} onChange={e => setTrackingForm({...trackingForm, deliveryStatus:e.target.value})}>
                      <option value="">Select Delivery Status (optional)</option>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="primary-button" type="submit"><Plus size={17}/> Add Update</button>
                  </form>

                  <div className="tracking-history">
                    <div className="panel-heading">
                      <div><h3>Tracking History</h3><p>Location and delivery updates for this order.</p></div>
                      <button className="secondary-button" onClick={() => loadTracking(selectedTrackingOrder)}><RefreshCw size={16}/> Refresh</button>
                    </div>
                    {loadingTracking ? <p>Loading tracking history...</p> :
                      trackingHistory.length > 0 ? (
                        <div className="timeline">
                          {trackingHistory.map(item => (
                            <div className="timeline-item" key={item.id}>
                              <div className="timeline-dot"><MapPin size={16}/></div>
                              <div className="timeline-content">
                                <strong>{item.currentLocation || "Location not provided"}</strong>
                                <p>{item.deliveryStatus || "Update"}</p>
                                {item.latitude != null && item.longitude != null && (
                                  <small>Coordinates: {item.latitude}, {item.longitude}</small>
                                )}
                                <small>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Time unavailable"}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="empty-message">No tracking updates have been added for this order.</p>
                    }
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function FormActions({ editing, noun, onCancel }) {
  return (
    <div className="form-actions">
      <button className="primary-button" type="submit">{editing ? `Update ${noun}` : `Save ${noun}`}</button>
      <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="action-group">
      <button className="icon-button edit" title="Edit" onClick={onEdit}><Pencil size={16}/></button>
      <button className="icon-button delete" title="Delete" onClick={onDelete}><Trash2 size={16}/></button>
    </div>
  );
}

function EmptyRow({ cols, text }) {
  return <tr><td colSpan={cols} className="text-center py-4">{text}</td></tr>;
}

export default App;
