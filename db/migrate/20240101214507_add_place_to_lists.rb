class AddPlaceToLists < ActiveRecord::Migration[7.1]
  def change
    add_column :lists, :place, :integer, null: false, default: 0
  end
end
