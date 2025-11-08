require 'ffaker'

ActiveRecord::Base.transaction do
  OrderDetail.destroy_all
  Order.destroy_all
  Product.destroy_all
  Category.destroy_all
  Customer.destroy_all
  Employee.destroy_all

  CATEGORIES_LIST = [
    "Столи", "Стільці", "Дивани", "Ліжка", "Шафи-купе",
    "Комоди", "Кухні", "Офісні меблі", "Декор", "Освітлення"
  ]

  categories = []
  CATEGORIES_LIST.each do |cat_name|
    categories << Category.create(name: cat_name)
  end

  employees = []
  5.times do
    full_name_ua = if [true, false].sample
                     "#{FFaker::NameUA.last_name_female} #{FFaker::NameUA.first_name_female} #{FFaker::NameUA.middle_name_female}"
                   else
                     "#{FFaker::NameUA.last_name_male} #{FFaker::NameUA.first_name_male} #{FFaker::NameUA.middle_name_male}"
                   end

    employees << Employee.create(
      full_name: full_name_ua,
      position: ["Консультант", "Менеджер", "Касир"].sample,
      phone: FFaker::PhoneNumberUA.mobile_phone_number
    )
  end

  customers = []
  30.times do
    full_name_ua = if [true, false].sample
                     "#{FFaker::NameUA.last_name_female} #{FFaker::NameUA.first_name_female} #{FFaker::NameUA.middle_name_female}"
                   else
                     "#{FFaker::NameUA.last_name_male} #{FFaker::NameUA.first_name_male} #{FFaker::NameUA.middle_name_male}"
                   end

    customers << Customer.create(
      full_name: full_name_ua,
      phone: FFaker::PhoneNumberUA.mobile_phone_number,
      email: FFaker::Internet.email,
      address: "#{FFaker::AddressUA.city}, #{FFaker::AddressUA.street_address}"
    )
  end

  products = []
  50.times do
    products << Product.create(
      name: FFaker::Product.name,
      description: FFaker::Lorem.sentence,
      price: rand(1000..25000.0).round(2),
      dimensions: "#{rand(50..200)}x#{rand(40..100)}x#{rand(50..100)}",
      material: ["Дуб", "Сосна", "ДСП", "Метал", "Скло", "Пластик"].sample,
      category: categories.sample
    )
  end

  40.times do
    order = Order.create(
      customer: customers.sample,
      employee: employees.sample,
      order_date: FFaker::Time.between(1.year.ago, Time.now),
      status: ["виконано", "в обробці", "скасовано"].sample,
      total_amount: 0
    )

    total_price = 0
    items_in_order = rand(1..5)
    picked_products = products.sample(items_in_order)

    picked_products.each do |product|
      next unless product
      quantity = rand(1..3)
      unit_price = product.price

      OrderDetail.create(
        order: order,
        product: product,
        quantity: quantity,
        unit_price: unit_price
      )

      total_price += (quantity * unit_price)
    end

    order.update(total_amount: total_price.round(2))
  end
end

puts "✅ Seed data successfully created!"
