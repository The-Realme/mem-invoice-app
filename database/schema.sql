CREATE TABLE company (

    id SERIAL PRIMARY KEY,

    company_name VARCHAR(100) NOT NULL,

    gst_number VARCHAR(30),

    phone VARCHAR(20),

    email VARCHAR(100),

    address TEXT,

    bank_name VARCHAR(100),

    account_number VARCHAR(50),

    ifsc VARCHAR(30),

    branch VARCHAR(100),

    letterhead_path TEXT,

    signature_path TEXT,

    terms TEXT,

    jurisdiction TEXT

);

CREATE TABLE customers (

    id SERIAL PRIMARY KEY,

    customer_name VARCHAR(150) NOT NULL,

    billing_address TEXT,

    shipping_address TEXT,

    state VARCHAR(100),

    gst_number VARCHAR(30),

    attention_person VARCHAR(100),

    phone VARCHAR(20),

    email VARCHAR(100)

);

CREATE TABLE products (

    id SERIAL PRIMARY KEY,

    description TEXT,

    hsn_code VARCHAR(30),

    default_price NUMERIC(12,2),

    gst_percentage NUMERIC(5,2)

);

CREATE TABLE documents (

    id SERIAL PRIMARY KEY,

    document_type VARCHAR(20) NOT NULL,

    document_number VARCHAR(50) UNIQUE,

    document_date DATE,

    order_number VARCHAR(50),

    order_date DATE,

    site VARCHAR(100),

    model_serial_number TEXT,

    customer_id INTEGER REFERENCES customers(id),

    subtotal NUMERIC(12,2),

    cgst NUMERIC(12,2),

    sgst NUMERIC(12,2),

    igst NUMERIC(12,2),

    freight NUMERIC(12,2),

    grand_total NUMERIC(12,2),

    amount_in_words TEXT,

    remarks TEXT

);

CREATE TABLE document_items (

    id SERIAL PRIMARY KEY,

    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,

    product_id INTEGER REFERENCES products(id),

    description TEXT,

    hsn_code VARCHAR(30),

    quantity NUMERIC(10,2),

    unit_price NUMERIC(12,2),

    gst_percentage NUMERIC(5,2),

    amount NUMERIC(12,2)

);

CREATE TABLE settings (

    id SERIAL PRIMARY KEY,

    invoice_prefix VARCHAR(20),

    quotation_prefix VARCHAR(20),

    next_invoice_number INTEGER,

    next_quotation_number INTEGER,

    default_gst NUMERIC(5,2)

);

CREATE TABLE sites (

    id SERIAL PRIMARY KEY,

    site_name VARCHAR(150),

    location TEXT
);