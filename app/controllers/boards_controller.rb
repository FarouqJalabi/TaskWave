class BoardsController < ApplicationController
  before_action :authorize_user!, only: [:destroy, :update, :show]
  before_action :authenticate_user!, only: [:create, :new]
  before_action :set_board, only: [:show, :update, :destroy]
  def index
    @user_boards = Board.where(creator_id:current_user)
  end
  def show
  end

  def new
    @board = Board.new
  end

  def create
      @board = current_user.boards.new(board_params)
      if @board.save
        redirect_to board_path(@board)
      elsif
        render :new, status: :unprocessable_entity
      end
  end
  def update
    if @board.update(board_params)
      redirect_to @board #! Bad because rerenders board for no reason
    else
      render :show, status: :unprocessable_entity
    end
  end
  def destroy
    @board.destroy
    redirect_to root_path, status: :see_other
  end
  private
  def set_board
    @board = Board.find(params[:id])
  end
  def board_params
    params.require(:board).permit(:name, :public, :background_url)
  end
  def authorize_user!
    authenticate_user!
    @board = Board.find(params[:id])
    unless @board.creator == current_user
      render root_path, status: :unauthorized
    end
  end
end
