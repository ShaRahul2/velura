import test from 'node:test'
import assert from 'node:assert/strict'
import { safeAdminCallback } from '../lib/adminAuth'
import { productSchema, validPrice, categorySchema } from '../lib/adminValidation'
import { availableOrderActions } from '../lib/orderActionPolicy'
const order={status:'pending' as const,paymentStatus:'unpaid' as const,paymentMethod:'card' as const,razorpayPaymentId:null,total:1000}
test('admin callbacks cannot leave the admin path or loop to login',()=>{
 for(const value of [null,'//evil.com','/administrator','/admin/login','/admin/../../shop','/admin\\evil'])assert.equal(safeAdminCallback(value),'/admin')
 assert.equal(safeAdminCallback('/admin/orders?q=abc'),'/admin/orders?q=abc')
})
test('invalid and unknown product fields are rejected',()=>{
 for(const value of [{price:-1},{price:1.5},{isActive:'false'},{reviews:-1},{rating:6},{cat:'unknown'},{admin:true}])assert.equal(productSchema.partial().safeParse(value).success,false)
 assert.equal(productSchema.partial().safeParse({isActive:false}).success,true)
 assert.equal(validPrice({price:200,oldPrice:100}),false)
 assert.equal(categorySchema.safeParse({label:'Lace',description:'',imageUrl:'javascript:alert(1)',sortOrder:0}).success,false)
})
test('unpaid online orders cannot enter fulfilment',()=>{
 assert.deepEqual(availableOrderActions(order).map(a=>a.id),['cancel'])
 assert.ok(!availableOrderActions({...order,status:'confirmed'}).some(a=>a.id==='ship'))
 assert.ok(availableOrderActions({...order,paymentStatus:'paid'}).some(a=>a.id==='confirm'))
})
test('COD collection and manual refunds have explicit semantics',()=>{
 const actions=availableOrderActions({...order,paymentMethod:'cod',status:'delivered',paymentStatus:'paid'})
 assert.match(actions.find(a=>a.id==='return')!.label,/manual refund completed/)
 assert.ok(availableOrderActions({...order,paymentMethod:'cod',status:'shipped'}).some(a=>a.id==='collect'))
 for(const status of ['returned','cancelled'] as const)assert.deepEqual(availableOrderActions({...order,status}),[])
})

test('refunded orders never advance and failed confirmed orders can be cancelled',()=>{
 assert.deepEqual(availableOrderActions({...order,paymentStatus:'refunded'}),[])
 assert.deepEqual(availableOrderActions({...order,status:'confirmed',paymentStatus:'failed'}).map(a=>a.id),['cancel'])
})
