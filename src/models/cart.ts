export default class CartModel {
    private conn
    constructor(connection) {
        this.conn = connection
    }
    async item_already_in_cart(product_id: number, user_id: number): Promise<boolean> {
        let sql = `select count(id) as count from carts_items where user_id=? and product_id=?;`
        let [res] = await this.conn.execute(sql, [user_id, product_id])
        let count = res[0].count
        if (count > 0)
            return true
        return false
    }
    async addToCart(product_id: number, user_id: number) {
        let sql = "insert into carts_items(product_id,user_id,quantity) values (?,?,1)"
        await this.conn.execute(sql, [product_id, user_id])
    }
    async getCart(user_id: number) {
        let sql = "select a.quantity,product_id,product_name,price,url as image_url,product_desc,image_name  from carts_items as a left join inventory as b on a.product_id=b.id left join products_images as c on a.product_id =c.its_product_id where user_id =?";
        const [res] = await this.conn.execute(sql, [user_id])
        return res;
    }
    async get_cart_item(user_id: number, product_id) {
        let sql = 'select * from carts_items where user_id=? and product_id=?;'
        const [res] = await this.conn.execute(sql, [user_id, product_id])
        return res[0];
    }
    async removeFromCart(product_id: number, user_id: number) {
        let sql = "delete from carts_items where product_id =? and user_id=?"
        await this.conn.execute(sql, [product_id, user_id])
    }
    async clearCart(user_id: number) {
        let sql = "delete from carts_items where user_id=?"
        await this.conn.execute(sql, [user_id])
    }
    async increase_cart_item_qunatity(product_id: number, user_id: number) {
        let sql = `
       update carts_items 
       set quantity =quantity+1
       where  product_id=? and user_id=?;
       `;
        await this.conn.execute(sql, [product_id, user_id])

        let sql2 = 'select quantity from carts_items where user_id=? and product_id=?;'
        const [res] = await this.conn.execute(sql2, [user_id, product_id])
        return res[0].quantity;
    }
    async decrease_cart_item_qunatity(product_id: number, user_id: number) {
        let sql =
            `update carts_items
             set quantity = if(quantity>1,quantity-1,1)
              where  product_id=? and user_id=?;`
    
        await this.conn.execute(sql, [product_id, user_id])
 
        let sql2 = 'select quantity from carts_items where user_id=? and product_id=?;'
        const [res] = await this.conn.execute(sql2, [user_id, product_id])
        return res[0].quantity;
   
    }
}