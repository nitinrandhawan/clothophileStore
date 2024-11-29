import { Cart } from "../Model/cart.js";
import { Product } from "../Model/product.js";
import { User } from "../Model/user.js";

export const findProductByColorSlug = async (colorSlug) => {
  try {
    const product = await Product.findOne({
      "colors.slug": colorSlug,
    });

    if (!product) {
      return null;
    }

    const colorVariant = product.colors.find(
      (color) => color.slug === colorSlug
    );

    return {
      product,
      colorVariant,
    };
  } catch (error) {
    console.error("Error finding product by color slug:", error);
    throw error;
  }
};

const AddToCart = async (req, res) => {
  const { user_id, slug,size,quantity } = req.body;
 
  if(!size){
    return res.status(401).json({
      "error":"Select size to add product in cart"
    })
  }
  if(!quantity){
    return res.status(401).json({
      "error":"Add quantity to add product in cart"
    })
  }
  await Cart.findOne({ user: user_id })
    .then(async (cart) => {
      await findProductByColorSlug(slug)
        .then(async (result) => {
          if (result) {
            let product = result.product;
            let colorVariant = result.colorVariant;

            if (cart) {
              if (!Array.isArray(cart.cartItems)) {
                cart.cartItems = [];
              }
              const itemIndex = cart.cartItems.findIndex(
                (item) =>
                  item.productId.equals(product._id) &&
                  item.slug === colorVariant.slug &&
                  item.size===size
              );

              if (itemIndex > -1) {
                cart.cartItems[itemIndex].quantity += quantity;
              } else {
                cart.cartItems.push({
                  productId: product._id,
                  quantity,
                  size,
                  discountedPrice:colorVariant.discountedPrice,
                  discount:colorVariant.discount,
                  name:product.name,
                  image:colorVariant.image,
                  color:colorVariant.colorName,
                  slug: colorVariant.slug,
                  price: colorVariant.price,
                });
              }

              cart.totalQuantity = cart.cartItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              );
              cart.totalPrice = cart.cartItems.reduce(
                (sum, item) => sum + item.quantity * item.discountedPrice,
                0
              );
              await cart.save();
              return res.status(200).json({
                successfully: "product is updated successfully in cart",
              });
            } else {
              // Create new cart if it doesn't exist

            await User.find({ _id: user_id })
                .then(async (user) => {
                  if (!user) {
                    return res.status(401).json({
                      error: "invalid user to add in cart",
                    });
                  }
                  const newCart = new Cart({
                    user: user_id,
                    cartItems: [
                      {
                        productId: product._id,
                        slug: colorVariant.slug,
                        quantity: quantity,
                        size,
                        discountedPrice:colorVariant.discountedPrice,
                        discount:colorVariant.discount,
                        name:product.name,
                        image:colorVariant.image,
                        color:colorVariant.colorName,
                        price: colorVariant.price,
                      },
                    ],
                    totalQuantity: 1,
                    totalPrice: colorVariant.discountedPrice,
                  });
                  await newCart.save();

                  return res.status(200).json({
                    successfully: "product is added successfully in cart",
                  });
                })
                .catch((err) => {
                  console.log("finding user in cart error:", err);

                  return res.status(501).json({
                    error: "internal error occurred",
                  });
                });
            }
          } else {
            console.log("No product or color variant found with that slug.");
          }
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((err) => {
      console.log("add to cart error:", err);
      return res.status(501).json({ error: "internal error occurred" });
    });
};

const RemoveFromCart = async (req, res) => {
  const { user_id, slug,size } = req.body;
if(!user_id||!slug ||!size){
return res.status(401).json({
  "error":"user id,size and slug all are required"
})
}
  try {
    const result = await findProductByColorSlug(slug);

    await Cart.findOne({ user: user_id })
      .then(async (cart) => {

        console.log("cart",cart);
        console.log('result',result.product._id);
        
        const ItemIndex = cart.cartItems.findIndex(
          (item) =>
           
            item.productId.equals(result.product._id) &&
                  item.slug === result.colorVariant.slug && item.size===size
        );

        console.log("itemindex",ItemIndex);
        
        if (ItemIndex > -1) {

          if(cart.cartItems[ItemIndex].quantity===1){
         cart.cartItems= cart.cartItems.filter((item)=>
            item.slug!==result.colorVariant.slug)
          }else{
            cart.cartItems[ItemIndex].quantity -= 1;
          }
          cart.totalQuantity = cart.cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          cart.totalPrice = cart.cartItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          await cart.save()

          return res.status(200).json({
            "success":"cart is removed successfully"
          })
        } else {
          return res.status(401).json({
            error: "no item in cart",
          });
        }
      })
      .catch((err) => {
        console.log("error find cart", err);

        return res.status(501).json({ error: "internal error occurred" });
      });
  } catch (error) {
    console.log("add to cart error:", err);
    return res.status(501).json({ error: "internal error occurred" });
  }
};

const DeleteFromCart=async(req,res)=>{
const {user_id,slug,size}=req.body;
if(!user_id||!slug){
  return res.status(401).json({
    "error":"user id and slug both are required"
  })
}

try {
 const cart=await Cart.findOne({user:user_id})
 cart.cartItems=cart.cartItems?.filter((item)=> item.slug!==slug || item.size!==size)
 await cart.save()
 return res.status(200).json({
  "success":"cart item is deleted"
 })
} catch (error) {
  console.log("finding cart in delete form cart error:",error);
  return res.status(401).json({
    "error":"internal error is occurred"
  })
}
}

const GetCart=async(req,res)=>{
const {user_id}=req.body;

await User.findOne({_id:user_id}).then(async(user)=>{
  if(!user){
    return res.status(401).json({
      "error":"UnAuthorized Request"
    })
  }else{
    await Cart.findOne({user:user_id}).select("-_id -user").then((cart)=>{
  return res.status(200).json({
    cart
  })
    })
  }
})

}
export { AddToCart, RemoveFromCart,GetCart,DeleteFromCart };
