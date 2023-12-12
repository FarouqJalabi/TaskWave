class RemovePublicFromBoard < ActiveRecord::Migration[7.1]
  def change
    remove_column :boards, :public, :boolean
  end
end
