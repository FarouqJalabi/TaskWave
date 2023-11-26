class AddPublicToBoard < ActiveRecord::Migration[7.1]
  def change
    add_column :boards, :public, :boolean, default: true
  end
end
