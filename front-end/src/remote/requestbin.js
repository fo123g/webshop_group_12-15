export function sendOrderData(url, items, user) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const data = {
        items,
        user,
    };

    const options = {
        method: "POST",
        headers,
        mode: "cors",
        body: JSON.stringify(data),
    };

    fetch(url, options);
}