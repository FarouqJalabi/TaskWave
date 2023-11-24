class AddPlaceToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :place, :integer, null: false, default: 0
  end
end
