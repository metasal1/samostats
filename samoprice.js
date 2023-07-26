export default async function samoPrice() {
    const samo = await fetch('https://price.jup.ag/v4/price?ids=SAMO')
    const body = await samo.json()
    console.log(body.data.SAMO.price)
    return body.data.SAMO.price
}

samoPrice()