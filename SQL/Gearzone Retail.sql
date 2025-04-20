
CREATE TABLE REGION (
    RegionID varchar(2) NOT NULL UNIQUE,
    RegionName TEXT NOT NULL,
    PRIMARY KEY ("RegionID")
);
---drop table REGION;
CREATE TABLE STORE (
    StoreID varchar(3) NOT NULL UNIQUE,
    StoreZip TEXT NOT NULL,
    RegionID varchar(2) NOT NULL,
    PRIMARY KEY ("StoreID"),
    FOREIGN KEY ("RegionID") REFERENCES REGION ("RegionID")
);

--drop table store;

CREATE TABLE CUSTOMER (
    CustomerID varchar(7) NOT NULL UNIQUE,
    CustomerName TEXT NOT NULL,
    CustomerZip TEXT NOT NULL,
    PRIMARY KEY ("CustomerID")
);

--drop table customer;

CREATE TABLE CATEGORY (
    CategoryID varchar(2) NOT NULL UNIQUE,
    CategoryName TEXT NOT NULL,
    PRIMARY KEY ("CategoryID")
);

--drop table category;

CREATE TABLE VENDOR (
    VendorID varchar(2) NOT NULL UNIQUE,
    VendorName TEXT NOT NULL,
    PRIMARY KEY ("VendorID")
);

--drop table VENDOR;

CREATE TABLE PRODUCT (
    ProductID varchar(6) NOT NULL UNIQUE,
    ProductName TEXT NOT NULL,
    ProductPrice DECIMAL(10, 2) NOT NULL,
    CategoryID varchar(2) NOT NULL,
    VendorID varchar(2) NOT NULL,
    PRIMARY KEY ("ProductID"),
    FOREIGN KEY ("CategoryID") REFERENCES CATEGORY ("CategoryID"),
    FOREIGN KEY ("VendorID") REFERENCES VENDOR ("VendorID")
);

--drop table PRODUCT;

CREATE TABLE SALES_TRANSACTION (
   TID varchar(4) NOT NULL,
   TDate DATE NOT NULL,
   StoreID varchar(2) NOT NULL,
  CustomerID varchar(7) NOT NULL,
     PRIMARY KEY ("TID"),
   FOREIGN KEY ("StoreID") REFERENCES STORE ("StoreID"),
  FOREIGN KEY ("CustomerID") REFERENCES CUSTOMER ("CustomerID")
);

--drop table SALES_TRANSACTION;


Create table Includes (
 ProductID varchar(7) NOT NULL,
 TID varchar(4) Not Null,
 Quantity integer,
  FOREIGN KEY ("ProductID") REFERENCES PRODUCT ("ProductID"),
  FOREIGN KEY ("TID") REFERENCES SALES_TRANSACTION ("TID")
 );

INSERT INTO REGION (RegionID, RegionName) VALUES ('MR', 'Mountain Region');
INSERT INTO REGION (RegionID, RegionName) VALUES ('CR', 'Coastal Region');
select * from region;
INSERT INTO STORE (StoreID, StoreZip, RegionID) VALUES ('S1', '80202', 'MR');
INSERT INTO STORE (StoreID, StoreZip, RegionID) VALUES ('S2', '94105', 'MR');
INSERT INTO STORE (StoreID, StoreZip, RegionID) VALUES ('S3', '30303', 'CR');
select * from STORE;
INSERT INTO CUSTOMER (CustomerID, CustomerName, CustomerZip) 
VALUES 
    ('1-1-111', 'Alex', '80202'),
    ('2-2-222', 'Jordan', '94105'),
    ('3-3-333', 'Taylor', '30303');
    
select * from CUSTOMER;

INSERT INTO VENDOR (VendorID, VendorName) 
VALUES 
    ('GS', 'Gear Supplies Co.'),
    ('TM', 'Trail Master Equipment');
select * from vendor;

INSERT INTO CATEGORY (CategoryID, CategoryName) 
VALUES 
    ('CG', 'Camping Gear'),
    ('FW', 'Footwear');
select * from category;

INSERT INTO PRODUCT (ProductID, ProductName, ProductPrice, VendorID, CategoryID) 
VALUES 
    ('1A1', 'Trail Backpack', 120.00, 'GS', 'CG'),
    ('2B2', 'Hiking Boots', 85.00, 'TM', 'FW'),
    ('3C3', 'Cozy Socks', 20.00, 'TM', 'FW'),
    ('4D4', 'Rainproof Jacket', 95.00, 'GS', 'FW'),
    ('5E5', 'Compact Tent', 180.00, 'TM', 'CG');
INSERT INTO PRODUCT (ProductID, ProductName, ProductPrice, VendorID, CategoryID) 
VALUES ('6F6', 'Outdoor Tent', 150.00, 'GS', 'CG'); 

select * from product;

INSERT INTO SALES_TRANSACTION (TID, CustomerID, StoreID, TDate) 
VALUES 
    ('T101', '1-1-111', 'S1','2022-01-01'),
    ('T202', '2-2-222', 'S2','2022-01-01'),
    ('T303', '1-1-111', 'S3','2022-01-02'),
    ('T404', '3-3-333', 'S3','2022-01-02'),
    ('T505', '2-2-222', 'S3','2022-01-02');
    
    
    
    
INSERT INTO SALES_TRANSACTION (TID, CustomerID, StoreID, TDate) 
VALUES 
   ('T101', '1-1-111', 'S1', '2022-01-01'),
   ('T202', '2-2-222', 'S2', '2022-01-01'),
   ('T303', '1-1-111', 'S3', '2022-01-02'),
   ('T404', '3-3-333', 'S3', '2022-01-02'),
   ('T505', '2-2-222', 'S3', '2022-01-02');
   
select * from sales_transaction;

INSERT INTO INCLUDES(ProductID, TID, Quantity)
VALUES 
    ('1A1','T101', 1),
    ('2B2','T202', 1),
    ('3C3','T303', 3),
    ('1A1','T303', 1),
    ('4D4','T404', 2);
    ('2B2','T404', 1),
    ('4D4','T505', 4),
    ('5E5','T505', 2);
INSERT INTO INCLUDES(ProductID, TID, Quantity)
VALUES     ('6F6','T505', 1);
 
INSERT INTO REGION (RegionID, RegionName) 
VALUES 
    ('NE', 'Northeast Region'),
    ('SW', 'Southwest Region'),
    ('SE', 'Southeast Region'),
    ('NW', 'Northwest Region'),
    ('PL', 'Plains Region'),
    ('CC', 'Central Coast'),
    ('WC', 'West Coast'),
    ('EC', 'East Coast'),
    ('AR', 'Arctic Region'),
    ('TR', 'Tropical Region'),
    ('SE1', 'Southern Region 1'),
    ('SE2', 'Southern Region 2'),
    ('SE3', 'Southern Region 3'),
    ('NE1', 'Northern Region 1'),
    ('NE2', 'Northern Region 2'),
    ('SW1', 'Western Region 1'),
    ('SW2', 'Western Region 2'),
    ('CW', 'Central West Region');

INSERT INTO STORE (StoreID, StoreZip, RegionID) 
VALUES 
    ('S4', '10101', 'NE'),
    ('S5', '20202', 'SW'),
    ('S6', '30303', 'SE'),
    ('S7', '40404', 'NW'),
    ('S8', '50505', 'PL'),
    ('S9', '60606', 'CC'),
    ('S10', '70707', 'WC'),
    ('S11', '80808', 'EC'),
    ('S12', '90909', 'AR'),
    ('S13', '10110', 'TR'),
    ('S14', '20211', 'SE1'),
    ('S15', '30312', 'SE2'),
    ('S16', '40413', 'SE3'),
    ('S17', '50514', 'NE1'),
    ('S18', '60615', 'NE2'),
    ('S19', '70716', 'SW1'),
    ('S20', '80817', 'SW2');

INSERT INTO CUSTOMER (CustomerID, CustomerName, CustomerZip) 
VALUES 
    ('4-4-444', 'Morgan', '10101'),
    ('5-5-555', 'Casey', '20202'),
    ('6-6-666', 'Jordan', '30303'),
    ('7-7-777', 'Taylor', '40404'),
    ('8-8-888', 'Alexis', '50505'),
    ('9-9-999', 'Jordan', '60606'),
    ('10-10-1010', 'Morgan', '70707'),
    ('11-11-1111', 'Charlie', '80808'),
    ('12-12-1212', 'Pat', '90909'),
    ('13-13-1313', 'Drew', '10110'), 
    ('14-14-1414', 'Quinn', '20211'),
    ('15-15-1515', 'Blake', '30312'),
    ('16-16-1616', 'Morgan', '40413'),
    ('17-17-1717', 'Jamie', '50514'),
    ('18-18-1818', 'Reese', '60615'),
    ('19-19-1919', 'Sam', '70716'),
    ('20-20-2020', 'Riley', '80817');
 
INSERT INTO CATEGORY (CategoryID, CategoryName) 
VALUES 
    ('CL', 'Climbing Gear'),
    ('AL', 'All-Terrain Gear'),
    ('SG', 'Survival Gear'),
    ('SK', 'Skiing Equipment'),
    ('BT', 'Biking Gear'),
    ('RT', 'Rafting Equipment'),
    ('HL', 'Hunting Gear'),
    ('FR', 'Fishing Gear'),
    ('WK', 'Waterproof Gear'),
    ('SL', 'Sleep Systems'),
    ('EQ', 'Equipment'),
    ('AC', 'Accessories'),
    ('WL', 'Water Sports Gear'),
    ('TG', 'Trekking Gear'),
    ('TS', 'Tactical Gear'),
    ('RL', 'Recovery Gear'),
    ('MT', 'Mountaineering Gear'),
    ('ST', 'Snowboarding Gear'),
    ('SA', 'Snowshoes'),
    ('AR', 'Archery Gear');
 
INSERT INTO VENDOR (VendorID, VendorName) 
VALUES 
    ('XY', 'Extreme Outdoors Inc.'),
    ('AB', 'Adventure Gear Co.'),
    ('CD', 'Camping Essentials Ltd.'),
    ('EF', 'Wild Outdoors LLC'),
    ('GH', 'Hike Pro Solutions'),
    ('IJ', 'Gear World Inc.'),
    ('KL', 'Explorer Gear Co.'),
    ('MN', 'Outdoor Supplies Ltd.'),
    ('OP', 'Trek Masters'),
    ('QR', 'Summit Gear Co.'),
    ('ST', 'Sunshine Gear Inc.'),
    ('UV', 'Ultimate Gear Co.'),
    ('WX', 'Wilderness Inc.'),
    ('YZ', 'Zion Gear Co.'),
    ('ZA', 'Zero Gravity Outdoors'),
    ('AA', 'All-Terrain Solutions'),
    ('BB', 'Backpackers Gear Co.'),
    ('CC', 'Climbing Experts Ltd.'),
    ('DD', 'Durable Gear Co.'),
    ('EE', 'Eco Gear Solutions');

INSERT INTO PRODUCT (ProductID, ProductName, ProductPrice, VendorID, CategoryID) 
VALUES 
    ('7G7', 'Hiking Backpack', 130.00, 'TM', 'CG'),
    ('8H8', 'Snow Boots', 75.00, 'GS', 'FW'),
    ('9I9', 'Running Shoes', 90.00, 'TM', 'FW'),
    ('10J10', 'Camping Stove', 55.00, 'GS', 'CG'),
    ('11K11', 'Thermal Socks', 20.00, 'GS', 'FW'),
    ('12L12', 'Sleeping Bag', 60.00, 'TM', 'CG'),
    ('13M13', 'Rain Poncho', 25.00, 'GS', 'FW'),
    ('14N14', 'Climbing Harness', 80.00, 'TM', 'CG'),
    ('15O15', 'Mountain Boots', 100.00, 'GS', 'FW'),
    ('16P16', 'Camping Lantern', 35.00, 'GS', 'CG'),
    ('17Q17', 'Trekking Poles', 40.00, 'TM', 'CG'),
    ('18R18', 'First Aid Kit', 20.00, 'GS', 'CG'),
    ('19S19', 'Portable Grill', 70.00, 'TM', 'CG'),
    ('20T20', 'Survival Knife', 45.00, 'GS', 'SG'),
    ('21U21', 'Hiking Hat', 15.00, 'TM', 'AC'),
    ('22V22', 'Portable Charger', 50.00, 'GS', 'AC'),
    ('23W23', 'Hydration Pack', 30.00, 'TM', 'CG');

INSERT INTO SALES_TRANSACTION (TID, CustomerID, StoreID, TDate) 
VALUES 
    ('T606', '4-4-444', 'S4', '2022-01-03'),
    ('T707', '5-5-555', 'S5', '2022-01-03'),
    ('T808', '6-6-666', 'S6', '2022-01-04'),
    ('T909', '7-7-777', 'S7', '2022-01-04'),
    ('T1010', '8-8-888', 'S8', '2022-01-05'),
    ('T1111', '9-9-999', 'S9', '2022-01-05'),
    ('T1212', '10-10-1010', 'S10', '2022-01-06'),
    ('T1313', '11-11-1111', 'S11', '2022-01-06'),
    ('T1414', '12-12-1212', 'S12', '2022-01-07'),
    ('T1515', '13-13-1313', 'S13', '2022-01-07'),
    ('T1616', '14-14-1414', 'S14', '2022-01-08'),
    ('T1717', '15-15-1515', 'S15', '2022-01-08'),
    ('T1818', '16-16-1616', 'S16', '2022-01-09'),
    ('T1919', '17-17-1717', 'S17', '2022-01-09'),
    ('T2020', '18-18-1818', 'S18', '2022-01-10');

INSERT INTO INCLUDES (ProductID, TID, Quantity)
VALUES 
    ('7G7', 'T606', 2),
    ('8H8', 'T707', 1),
    ('9I9', 'T808', 1),
    ('10J10', 'T909', 2),
    ('11K11', 'T1010', 3),
    ('12L12', 'T1111', 1),
    ('13M13', 'T1212', 2),
    ('14N14', 'T1313', 1),
    ('15O15', 'T1414', 1),
    ('16P16', 'T1515', 4),
    ('17Q17', 'T1616', 2),
    ('18R18', 'T1717', 5),
    ('19S19', 'T1818', 1),
    ('20T20', 'T1919', 2),
    ('21U21', 'T2020', 3);




SELECT * FROM CATEGORY;
SELECT * FROM CUSTOMER;
SELECT * FROM Includes;
SELECT * FROM PRODUCT;
SELECT * FROM REGION;
SELECT * FROM SALES_TRANSACTION;
SELECT * FROM STORE;
SELECT * FROM VENDOR;



--Business Objective one
-- Identifying top 5 Most frequent customers for loyalty program
SELECT 
    C.CustomerID, 
    C.CustomerName, 
    COUNT(ST.TID) AS TransactionCount
FROM 
    CUSTOMER C
JOIN 
    SALES_TRANSACTION ST ON C.CustomerID = ST.CustomerID
GROUP BY 
    C.CustomerID, C.CustomerName
ORDER BY 
    TransactionCount DESC
LIMIT 5;

--Calculate region-wise products with total sales above the average total sales within each region


WITH ProductSales AS (
    SELECT 
        r.RegionID,
        i.ProductID,
        SUM(i.Quantity * p.ProductPrice) AS TotalProductSales
    FROM 
        Includes i
    JOIN 
        Product p ON i.ProductID = p.ProductID
    JOIN 
        Sales_Transaction st ON i.TID = st.TID
    JOIN 
        Store s ON st.StoreID = s.StoreID
    JOIN 
        Region r ON s.RegionID = r.RegionID
    GROUP BY 
        1, 2
),
RegionAverageSales AS (
    SELECT 
        RegionID,
        AVG(TotalProductSales) AS AvgSales
    FROM 
        ProductSales
    GROUP BY 
        1
)
SELECT 
    ps.RegionID,
    ps.ProductID,
    p.ProductName,
    ps.TotalProductSales
FROM 
    ProductSales ps
JOIN 
    Product p ON ps.ProductID = p.ProductID
JOIN 
    RegionAverageSales ras ON ps.RegionID = ras.RegionID
WHERE 
    ps.TotalProductSales >= ras.AvgSales
ORDER BY 
    1, 4 DESC;
    
   
    





