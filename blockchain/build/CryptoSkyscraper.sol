// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract CryptoSkyscraper {
    address public owner;

    struct Apartment {
        string name;
        uint totalShares;
        uint availableShares;
        uint pricePerShare; // Preço em Wei
    }

    Apartment[] public apartments;
    mapping(address => mapping(uint => uint)) public sharesBalances;

    constructor() {
        owner = msg.sender;
        // primeiro apartamento
        apartments.push(Apartment("Apartment 1", 1000, 1000, 0.01 ether));
        // segundo apartamento
        apartments.push(Apartment("Apartment 2", 400, 400, 0.05 ether));
    }

    function getApartmentStockBalance(uint apartmentId) public view returns (uint) {
        return apartments[apartmentId].availableShares;
    }

    function restock(uint apartmentId, uint amount) public {
        require(msg.sender == owner, "Owner needed to restock");
        apartments[apartmentId].availableShares += amount;
    }

    function purchase(uint apartmentId, uint amount) public payable {
        Apartment storage apartment = apartments[apartmentId];
        require(msg.value >= amount * apartment.pricePerShare, "Insufficient payment");
        require(apartment.availableShares >= amount, "Not enough shares available");
        apartment.availableShares -= amount;
        sharesBalances[msg.sender][apartmentId] += amount;
    }
}
