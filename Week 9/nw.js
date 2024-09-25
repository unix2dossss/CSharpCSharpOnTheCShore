async function PickItems() {
    const url = "https://services.odata.org/Northwind/Northwind.svc/Orders";
    const response = await fetch(url);
    const data = await response.json();
    console.log("okay");
    PopulateItems(data.value);
}

async function PopulateItems(items) {
    console.log(items);
    console.log("ssdfsdf");
}

PickItems()
console.log("HELLO");