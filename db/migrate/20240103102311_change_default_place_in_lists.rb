class ChangeDefaultPlaceInLists < ActiveRecord::Migration[7.1]
  def change
    change_column_default :lists, :place, 999
  end

end
