class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.string :full_name, null: false
      t.string :phone, null: false
      t.string :email
      t.string :address

      t.timestamps
    end
    add_index :customers, :email, unique: true
  end
end
