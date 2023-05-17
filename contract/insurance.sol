// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ProductInsurance {
    address public admin = 0x8491106BA7C7806577E216f8560E9f3d9eCC5ecd;
    address public police = 0x61C40bc0Aa7D2aa1a89535C91Ea7bc1762a76513;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
    _;
    }

     modifier onlyPolice() {
        require(msg.sender == police, "Only police can perform this action");
    _;
    }

    struct Product {
        string id;
        string brand;
        string model;
        string productImage;
        uint256 productPrice;
        uint256 insurancePrice;
        address owner;
        string purchaseDate;
        string startDate;
        string endDate;
        InsuranceStatus insuranceStatus;
        string insuranceStatusDescription;
    }

    enum InsuranceStatus { Valid, Invalid, Replace, Repair, Refund_Approved, Refund_Success, Claim_Filed, Under_Investigation, Claim_Rejected }

    mapping(uint256 => Product) public products;
    mapping(uint256 => bool) public hasInsurance;
    mapping(uint256 => bool) public hasClaim;

    event ProductAdded(uint256 productId);
    event InsuranceAdded(uint256 productId);
    event ClaimAdded(uint256 productId);
    event InsuranceStatusUpdated(uint256 productId, InsuranceStatus status, string description);

    uint256 private productIdCounter;

    // function to add product
    function addProduct(string memory id, string memory brand, string memory model, string memory productImage, uint256 productPrice,string memory purchaseDate, address owner) public payable {
        require(msg.value == productPrice, "Product price not sent with the function call");

        productIdCounter++;
        products[productIdCounter] = Product({
            id: id,
            brand: brand,
            model: model,
            productImage: productImage,
            productPrice: productPrice,
            insurancePrice: 0,
            owner: owner,
            purchaseDate: purchaseDate,
            startDate: "",
            endDate: "",
            insuranceStatus: InsuranceStatus.Invalid,
            insuranceStatusDescription: ""
        });

        payable(admin).transfer(msg.value);

        emit ProductAdded(productIdCounter);
    }


    
    // function to add insurance for product
    function addInsurance(uint256 productId, string memory startDate, string memory endDate, uint256 insurancePrice) public payable {
    require(productId <= productIdCounter, "Invalid product ID");
    require(msg.value == insurancePrice, "Insurance price not sent with the function call");
    
    require(stringToTimestamp(startDate) < stringToTimestamp(endDate),"End Date should be after start date");
    require(block.timestamp < stringToTimestamp(endDate), "End Date should be greater than current date");

    products[productId].startDate = startDate;
    products[productId].endDate = endDate;
    products[productId].insurancePrice = insurancePrice;

    products[productId].insuranceStatus = InsuranceStatus.Valid;
    hasInsurance[productId] = true;
    hasClaim[productId] = false;


    payable(admin).transfer(msg.value);

    emit InsuranceAdded(productId);
}



    // function to add claim to product
    function addClaim(uint256 productId) public {
        require(productId <= productIdCounter, "Invalid product ID");

        require(hasInsurance[productId], "No insurance found for this product");

        require(!hasClaim[productId], "Claim already exists for this product");

        require(block.timestamp <= stringToTimestamp(products[productId].endDate), "Product warranty has expired");

        products[productId].insuranceStatus = InsuranceStatus.Claim_Filed;

        hasClaim[productId] = true;

        emit ClaimAdded(productId);
    }

   function stringToTimestamp(string memory _date) public pure returns (uint256) {
    bytes memory _dateBytes = bytes(_date);
    uint256 year;
    uint256 month;
    uint256 day;

    // Extract year
    for (uint256 i = 0; i < 4; i++) {
        year = year * 10 + uint8(_dateBytes[i]) - 48;
    }

    // Extract month
    for (uint256 i = 5; i < 7; i++) {
        month = month * 10 + uint8(_dateBytes[i]) - 48;
    }

    // Extract day
    for (uint256 i = 8; i < 10; i++) {
        day = day * 10 + uint8(_dateBytes[i]) - 48;
    }

    // Calculate timestamp
    uint256 secondsInDay = 86400;
    uint256 secondsInMonth = 2592000;
    uint256 secondsInYear = 31536000;
    uint256 leapSeconds = 86400;

    uint256 timestamp = ((year - 1970) * secondsInYear) + ((month - 1) * secondsInMonth) + ((day - 1) * secondsInDay);

    // Adjust for leap years
    uint256 numLeapYears = (year - 1968) / 4 - (year - 1900) / 100 + (year - 1600) / 400;
    timestamp += numLeapYears * leapSeconds;

    return timestamp;
}




    // function to update the insurance status
    function updateInsuranceStatus(uint256 productId, InsuranceStatus status, string memory description) public {
        require(productId <= productIdCounter, "Invalid product ID");

        require(hasInsurance[productId], "No insurance found for this product");

        require(status != InsuranceStatus.Valid, "Cannot set status to Valid");

        products[productId].insuranceStatus = status;
        products[productId].insuranceStatusDescription = description;

        emit InsuranceStatusUpdated(productId, status, description);
    }


    // function to get all the products purchased by the current account logged in 
    function getMyProducts() public view returns (Product[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (products[i].owner == msg.sender) {
                count++;
            }
        }

        Product[] memory myProducts = new Product[](count);

        uint256 j = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (products[i].owner == msg.sender) {
                myProducts[j] = products[i];
                j++;
            }
        }

        return myProducts;
    }

    // function to get all the claims that are present
    // used by the admin
    function getAllClaims() public view returns (Product[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (hasClaim[i]) {
                count++;
            }
        }

        Product[] memory claims = new Product[](count);
        uint256 j = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (hasClaim[i]) {
                claims[j] = products[i];
                j++;
            }
        }

        return claims;
    }

    // function to get all the claims under investigation
    // used by police account
     function getAllClaimsUnderInvestigation() public view onlyPolice returns (Product[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (hasClaim[i] && products[i].insuranceStatus == InsuranceStatus.Under_Investigation) {
                count++;
            }
        }

        Product[] memory claims = new Product[](count);
        uint256 j = 0;

        for (uint256 i = 1; i <= productIdCounter; i++) {
            if (hasClaim[i] && products[i].insuranceStatus == InsuranceStatus.Under_Investigation) {
                claims[j] = products[i];
                j++;
            }
        }

        return claims;
    }


    // function to update the insurance status of a product by the police
    // used by police account
      function updateInsuranceStatusPolice(uint256 productId, InsuranceStatus status, string memory description) public onlyPolice{
        require(productId <= productIdCounter, "Invalid product ID");
        require(hasInsurance[productId], "No insurance found for this product");
        require(status != InsuranceStatus.Valid, "Cannot set status to Valid");
        
        require(status == InsuranceStatus.Refund_Approved || status == InsuranceStatus.Claim_Rejected,"Ivalid change of status by police");

        products[productId].insuranceStatus = status;
        products[productId].insuranceStatusDescription = description;

        emit InsuranceStatusUpdated(productId, status, description);
        
    }

    // function to send refund to buyer
    // admin user function
    function sendRefund(uint256 productId) public payable onlyAdmin {
        require(products[productId].insuranceStatus == InsuranceStatus.Refund_Approved, "Product refund not approved");
        require(msg.value == products[productId].productPrice, "Incorrect amount sent");

        address payable owner = payable(products[productId].owner);
        owner.transfer(msg.value);

        products[productId].insuranceStatus = InsuranceStatus.Refund_Success;
        emit InsuranceStatusUpdated(productId, InsuranceStatus.Refund_Success, "Product price refunded to owner");
    }

}

