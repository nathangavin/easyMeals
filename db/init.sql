CREATE DATABASE IF NOT EXISTS easyMeals;
USE easyMeals;

CREATE TABLE IF NOT EXISTS Units (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    description VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Pantries (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Tokens (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    token VARCHAR(100) NOT NULL,
    expiryTime BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipes (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Users (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(256) UNIQUE,
    loginTokenID INT,

    CONSTRAINT user_login
    FOREIGN KEY(loginTokenID)
    REFERENCES Tokens(ID)
);

CREATE TABLE IF NOT EXISTS Ingredients (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    unitID INT NOT NULL,

    CONSTRAINT i_unit
    FOREIGN KEY(unitID) 
    REFERENCES Units(ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS IngredientQuantities (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    ingredientID INT NOT NULL,
    quantity INT NOT NULL,

    CONSTRAINT q_ingredient
    FOREIGN KEY(ingredientID)
    REFERENCES Ingredients(ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Instructions (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    description VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS InstructionIngredientQuantities (
    quantityID INT NOT NULL,
    instructionID INT NOT NULL,

    CONSTRAINT i_quantity
    FOREIGN KEY(quantityID) 
    REFERENCES IngredientQuantities(ID)
    ON DELETE CASCADE,

    CONSTRAINT i_instruction
    FOREIGN KEY(instructionID)
    REFERENCES Instructions(ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PantryIngredientQuantities (
    quantityID INT NOT NULL,
    pantryID INT NOT NULL,

    CONSTRAINT p_quantity
    FOREIGN KEY(quantityID) 
    REFERENCES IngredientQuantities(ID),

    CONSTRAINT p_pantry
    FOREIGN KEY(pantryID)
    REFERENCES Pantries(ID)
);

CREATE TABLE IF NOT EXISTS UserPantries (
    userID INT NOT NULL,
    pantryID INT NOT NULL,

    CONSTRAINT u_user
    FOREIGN KEY(userID)
    REFERENCES Users(ID)
    ON DELETE CASCADE,

    CONSTRAINT u_pantry
    FOREIGN KEY(pantryID)
    REFERENCES Pantries(ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserRecipes (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),

    CONSTRAINT ur_user
    FOREIGN KEY(userID)
    REFERENCES Users(ID)
);
