import express from 'express';
import { OrderController } from '../controller/order.controller';
import { order } from '../documents/IORDER';
import { DeleteORDER, GetORDER, SaveReqORDER, UpdateReqORDER } from '../requests/order.request';
import { SaveUpdateResORDER } from '../responce/order.res';
import CustomeError from '../utills/error';
import jwt from "jsonwebtoken";
import { waiter,Admin } from "../routes/waiter.route"
import { OrderSchema } from '../model/order.model';


export class AdminRoutes {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.routes();
  }
  routes() {
    // this.router.post('/getOrder', async (req, res, next) => {
    //   try {
    //     const getreq:GetORDER = req.body;
    //       const admin:SaveUpdateResORDER = await new OrderController().getadmin(getreq);
    //       res.send(admin);
    //   } catch (error) {
    //     next(error);
    //   }
    // });
    this.router.post('/saveOrder',waiter, async (req, res, next) => {
      try {
        // const admin: SaveReqORDER = req.body;
        const admin: order[] = req.body;
        // const {_id} = res.locals.jwtPayload
        // const token:any = req.header('token');
        // console.log(token,"token")
        // const vei = jwt.verify(token,"WAHAB")
       
        // const a = res.locals.jwtPayload = vei;
      //  res.locals.jwtPayload = vei;
        // console.log(a,"aaaa")
        // const {_id} = res.locals.jwtPayload
        // console.log(_id)
        // console.log(admin,_id)
        // let totalamount = 0
        // for(let i =0;i<admin.length;i++){
        //   totalamount = totalamount + admin[i].price 
        // }
        // const data = {
        //   "user" : "6136064563cc83ec38cc3336",
        //   "orderItems" : admin,
        //   "totalPrice" : totalamount
        //  }
        console.log(req.header('token'),"from waiter")

        let token:any = req.header('token')
        console.log(token,"from routes")
        const vei:any = jwt.verify(token,"WAHAB")
        console.log(vei,"eveve")
        const a = res.locals.jwtPayload = vei;
        const {_id} = res.locals.jwtPayload
        let user = _id

        // let user = OrderController.getuser(user)
        const newAdmin:SaveUpdateResORDER = await new OrderController(user).saveadmin(admin);
       console.log(newAdmin)
       let queue :SaveUpdateResORDER[]=[];
         queue.push(newAdmin)
         console.log(queue,"que")
        res.status(200).json({
          message: newAdmin
        });
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/getmyorderlist',waiter ,async (req, res, next) => {
      try {
        let token:any = req.header('token')
        console.log(res.locals.jwtPayload._id)
      // console.log(token,"from routes")
      const vei:any = jwt.verify(token,"WAHAB")
      // console.log(vei,"eveve")
      const a = res.locals.jwtPayload = vei;
      const {_id} = res.locals.jwtPayload
        const adminList: SaveUpdateResORDER[] = await new OrderController(_id).getmyorderList();
        res.status(200).json({
          result: adminList
        });

      } catch (error) {
        next(error);
      }
    });

    this.router.post('/getallorderlist',Admin ,async (req, res, next) => {
      try {
        const adminList: SaveUpdateResORDER[] = await new OrderController().getallorderList();
        res.status(200).json({
          result: adminList
        });

      } catch (error) {
        next(error);
      }
    });
    this.router.post('/AcceptOrder',Admin ,async (req, res, next) => {
        try {
          const getreq:GetORDER = req.body;
            const order:SaveUpdateResORDER = await new OrderController().accpetadmin(getreq);
            // **********************************
            if(order){
              if(order.isAccepted === false){
                // console.log(order)
                // const up ={
                //   isDelivered = true
                // }
                // order[0].isDelivered =true
                const whab = await OrderSchema.findByIdAndUpdate(order._id,{$set:  {isAccepted : true}},{
                  returnOriginal :false,
                })
                console.log(whab)
                console.log("whab")
                let time = 15;
                  const timeValue = setInterval(async(interval:any) => {
                  time = time - 1;
                  console.log(time)
                  await OrderSchema.findByIdAndUpdate(order._id,{$set:  {waitingtime : time+"m"}})
                  if (time <= 0) {
                    clearInterval(timeValue);
                  }
                }, 60000);
                // await whab.save()
                return res.send("Your order is Accepted")
              }else{
                return res.send("Order is allready delerverd")
              }
              // console.log("helooo")
             }else{
              res.send("order doesnot exisit")
             }

            // **********************************
            // res.send(admin);
        } catch (error) {
          next(error);
        }
      });



    // this.router.put('/updateOrder', async (req, res, next) => {
    //   try {
    //     const admin: UpdateReqORDER = req.body;
    //     const upadated_admin:SaveUpdateResORDER = await new OrderController().updateAdmin(admin);
    //     const response = {
    //       upadated_admin,
    //     };
    //     res.status(200).json({
    //       message: response
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // });
    // this.router.delete('/deleteOrder', async (req, res, next) => {
    //   try {
    //     const delreq:DeleteORDER = req.body;
    //     const Deleted_admin = await new OrderController().deletadmin(delreq);
    //     res.status(200).json({
    //       message: 'admin deleted'
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // });
    // this.router.post('/getOrderlist', async (req, res, next) => {
    //   try {
    //     const adminList: SaveUpdateResORDER[] = await new OrderController().getadminList();
    //     res.status(200).json({
    //       result: adminList
    //     });

    //   } catch (error) {
    //     next(error);
    //   }
    // });
  }
}
export const OrderRoutesApi = new AdminRoutes().router;