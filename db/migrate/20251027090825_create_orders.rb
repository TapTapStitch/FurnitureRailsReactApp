class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :employee, null: false, foreign_key: true
      t.date :order_date, null: false
      t.string :status, null: false, default: 'pending'
      t.decimal :total_amount, precision: 10, scale: 2

      t.timestamps
    end
    add_index :orders, :status
  end
end
