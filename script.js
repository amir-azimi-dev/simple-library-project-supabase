"use strict"

const headers = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuaXBraGZtYXRhZ254bnllbnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0ODI0NDYsImV4cCI6MjAwNDA1ODQ0Nn0.zpelTwJC9p00HjCRr5XB5oedR1cocsh-Ba0fsexH_gM",

    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuaXBraGZtYXRhZ254bnllbnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0ODI0NDYsImV4cCI6MjAwNDA1ODQ0Nn0.zpelTwJC9p00HjCRr5XB5oedR1cocsh-Ba0fsexH_gM",

    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}



const insertRow = async (name, price, author) => {
    await fetch("https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name, price, author })
    })
        .then(Response => console.log(Response))
        .catch(err => console.log(err))
}


const getColValues = colName => {
    fetch(`https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books?select=${colName}`, {
        method: "GET",
        headers: headers
    })
        .then(data => data.json())
        .then(data => console.log(data))
}

const getRow = (colName, value) => {
    fetch(`https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books?${colName}=eq.${value}`, {
        method: "GET",
        headers: headers
    })
        .then(data => data.json())
        .then(data => console.log(data))

}


const getAll = async () => {
    let data
    await fetch("https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books?select=*", {
        method: "GET",
        headers: headers
    })
        .then(res => res.json())
        .then(d => {
            data = d
        })
    return data
}

const updateRow = async (id, name, price, author) => {
    await fetch(`https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books?id=eq.${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ name, price, author })
    })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}


const deleteRow = async id => {
    await fetch(`https://qnipkhfmatagnxnyensk.supabase.co/rest/v1/books?id=eq.${id}`, {
        method: "DELETE",
        headers: headers,
    })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const clearDb = async () => {
    let allItems = await getAll();
    await allItems.forEach(async item => await deleteRow(item.id))
    console.log("database has been cleared.");
}


// insertRow("golestan", 12000, "Sadi")
// getColValues("name")
// getRow("id", 1)
// console.log(getAll());
// updateRow(1, "boostan", 2222, "Sadi")
// deleteRow(10)
// clearDb()

const $ = document;
const table = $.querySelector(".table");
const tbody = $.querySelector("#tbody");
const nameInputElem = $.getElementById("name");
const priceInputElem = $.getElementById("price");
const authorInputElem = $.getElementById("author");
const addBookBtn = $.getElementById("addBookBtn");
const clearBtn = $.getElementById("clearBtn");

// modal
const editCreatedAtInputElem = $.getElementById("edit-created-at");
const editNameInputElem = $.getElementById("edit-name");
const editIdInputElem = $.getElementById("edit-id");
const editPriceInputElem = $.getElementById("edit-price");
const editAuthorInputElem = $.getElementById("edit-author");
const submitEditBtn = $.getElementById("submitEditBtn");


const resetForm = () => {
    nameInputElem.value = ""
    priceInputElem.value = ""
    authorInputElem.value = ""
}

const showAllBooks = async () => {
    let allBooks = await getAll();
    tbody.innerHTML = ""
    let tbodyTemplate = ""
    allBooks.forEach(book => {
        tbodyTemplate +=
            `<tr>
                <th>${book.id}</th>
                <td>${book.created_at}</td>
                <td>${book.name}</td>
                <td>${book.price}</td>
                <td>${book.author}</td>
                <td><i class='fa-solid fa-trash' onclick='removeBook(${book.id})'></i></td>
                <td><i class='fa-sharp fa-solid fa-pen-to-square' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='editBookHandler("${book.id}", "${book.created_at}", "${book.name}", "${book.price}", "${book.author}")'></i></td>
            </tr>`
    });
    tbody.innerHTML = tbodyTemplate
}

async function removeBook(id) {
    let isSure = confirm("are you sure?");
    if (isSure) {
        await deleteRow(id);
        showAllBooks();
    }
};

function editBookHandler(id, created_at, name, price, author) {
    console.log(id, created_at, name, price, author);
    editIdInputElem.value = id;
    editCreatedAtInputElem.value = created_at;
    editNameInputElem.value = name;
    editPriceInputElem.value = price;
    editAuthorInputElem.value = author;

    submitEditBtn.onclick = async () => {
        if (editNameInputElem.value && editPriceInputElem.value && editAuthorInputElem.value) {
            await updateRow(id, editNameInputElem.value.trim(), editPriceInputElem.value.trim(), editAuthorInputElem.value.trim());
            showAllBooks()
        }
    }
}

const addBook = async event => {
    event.preventDefault();
    let nameInputVal = nameInputElem.value.trim();
    let priceInputVal = priceInputElem.value.trim();
    let authorInputVal = authorInputElem.value.trim();
    if (nameInputVal && priceInputVal && authorInputVal) {
        await insertRow(nameInputVal, priceInputVal, authorInputVal);
        showAllBooks()
    };
    resetForm();
};
const clear = async event => {
    event.preventDefault();
    await clearDb();
    setTimeout(() => {
        showAllBooks();
    }, 4000);
};

addBookBtn.addEventListener("click", e => addBook(e));
clearBtn.addEventListener("click", e => clear(e));
showAllBooks()