// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ========================================
// BASE QUEST BADGES — ERC-1155 NFT
// ========================================
// Каждый badge — отдельный tokenId (1-6)
// Минтит только owner (серверный кошелёк)
// Пользователь получает NFT бесплатно за прохождение квестов

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BaseQuestBadges is ERC1155, Ownable {
    using Strings for uint256;

    // Название и символ коллекции
    string public name = "Base Quest Badges";
    string public symbol = "BQB";

    // Базовый URI для метаданных
    string private _baseURI;

    // Маппинг: tokenId => максимальный supply (0 = безлимит)
    mapping(uint256 => uint256) public maxSupply;

    // Маппинг: tokenId => текущий supply
    mapping(uint256 => uint256) public totalSupply;

    // Защита от двойного минта: user => tokenId => minted
    mapping(address => mapping(uint256 => bool)) public hasMinted;

    // События
    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 timestamp);

    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {
        _baseURI = baseURI;
    }

    // Минт бейджа (только owner — серверный кошелёк)
    function mint(address to, uint256 tokenId) external onlyOwner {
        require(!hasMinted[to][tokenId], "Already minted this badge");
        require(
            maxSupply[tokenId] == 0 || totalSupply[tokenId] < maxSupply[tokenId],
            "Max supply reached"
        );

        hasMinted[to][tokenId] = true;
        totalSupply[tokenId]++;
        _mint(to, tokenId, 1, "");

        emit BadgeMinted(to, tokenId, block.timestamp);
    }

    // Батч-минт нескольких бейджей
    function mintBatch(address to, uint256[] calldata tokenIds) external onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!hasMinted[to][tokenIds[i]]) {
                if (maxSupply[tokenIds[i]] == 0 || totalSupply[tokenIds[i]] < maxSupply[tokenIds[i]]) {
                    hasMinted[to][tokenIds[i]] = true;
                    totalSupply[tokenIds[i]]++;
                    _mint(to, tokenIds[i], 1, "");
                    emit BadgeMinted(to, tokenIds[i], block.timestamp);
                }
            }
        }
    }

    // Установка макс. supply (0 = безлимит)
    function setMaxSupply(uint256 tokenId, uint256 _maxSupply) external onlyOwner {
        maxSupply[tokenId] = _maxSupply;
    }

    // Обновление базового URI для метаданных
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }

    // URI для конкретного tokenId
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseURI, tokenId.toString(), ".json"));
    }
}
