class BookMark extends React.Component{


    componentDidMount(){

    }

    render(){
        return <div className="flex-container">
            <Left {...this.state}   />

            <div  className="right" ref={(dom)=>{_this.content=dom}} >
                <div className="wy_toolbar" ref={(dom)=>{

                }
                }>
                            <span >
                                  <Icon type="book" theme="outlined" />
                                &nbsp;
                                <Breadcrumb style={{display: 'inline-block'}}>
                                {bread.map(v => <Breadcrumb.Item style={{cursor: "pointer"}}
                                                                 onClick={_this.nodeSelect.bind(this, v)}>{v.title}</Breadcrumb.Item>)}
                            </Breadcrumb>
                            </span>
                    <span style={{float:'right'}}>




                          </span>

                </div>
                <ContentCard onRef={(contentCard)=>{
                    this.contentCard=contentCard;
                }}  {...this.state} style={{minHeight:'calc(100vh - 230px)'}}
                             handleClick={({node,urls, bread}) => _this.reduceState({selectedNode:{id:node.id},urls: urls, bread: bread})}
                             dealTag={_this.dealTag}
                             deleteItem={_this.deleteItem}
                             filter={_this.filter}/>
                <div   style={{textAlign: 'center',padding:'2em 0em'}}>
                    Professional Bookmark Manager ©2018 Created By changhui.wy
                    <div ref={(dom)=>{
                        dom&&_this.intersectionObserver.observe(dom);
                    }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
                </div>
            </div>
        </div>
    }
}