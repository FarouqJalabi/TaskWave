class ListsController < ApplicationController
  before_action :authorize_user!
  before_action :set_list, only: [:update, :destroy]
  def create
    @board = Board.find(params[:board_id])
    @list = @board.lists.create(list_params)
    @list.save
    puts "FAROUQ", list_params
    redirect_to board_path(@board)
  end
  def update
    if params[:listsOrder]
      puts "Farouq"
      list_order =  params[:listsOrder].split(",")
      conditions = list_order.map { |id| "WHEN #{id} THEN #{list_order.index(id)}" }.join(' ')
      List.where(id: list_order).update_all(["place = CASE id #{conditions} END"])

      respond_to do |format|
        format.json
      end
    else
      # redirect_to board_path(@list.board_id)
      @list.update(list_params)
      render board_path(@list.board_id)
    end
  end
  def destroy
    board_id = @list.board_id
    @list.destroy
    redirect_to board_path(board_id), status: :see_other
  end
  private
  def list_params
    if params[:list].present?
      params.require(:list).permit(:name)
    elsif params[:listsOrder].present?
      params.permit(:listsOrder)
    else
      {}
    end
  end
  def set_list
    @list = List.find(params[:id])
  end
  def authorize_user!
    authenticate_user!
    @board = Board.find(params[:board_id])
    unless @board.creator == current_user
      render "boards/show", status: :unauthorized
    end
  end
end
