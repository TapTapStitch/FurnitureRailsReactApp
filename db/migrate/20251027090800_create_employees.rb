class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :position, null: false
      t.string :phone

      t.timestamps
    end
  end
end
