class ResetDefaultPlaceInLists < ActiveRecord::Migration[7.1]
  def change
    change_column_default :lists, :place, 0
  end
end
